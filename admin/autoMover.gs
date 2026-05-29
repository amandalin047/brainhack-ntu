//NOTES TO SELF:

const SPREADSHEET_ID = "spreadsheet_id"; //response spreadsheet (this spreadsheet)
const ROOT_FOLDER_ID = "root_folder_id"; //students
const UPLOAD = "UPLOAD";
const TIMESTAMP_COLUMN = 1, STUDENT_NAME_COLUMN = 2, SCHOOL_COLUMN = 3, STUDENT_ID_COLUMN = 4;
const MODULE_NAME_COLUMN = 5, FILE_SUBMISSION_URL_COLUMN = 6;
const OPTIONAL_ANSWER = 7;
const GRADE = 8, MOVE_STATUS = 9;
const TA = 10, FILE_ID_COLUMN = 11, MODULE_FOLDER_COLUMN = 12, ERROR_COLUMN = 13;
const moduleToFolder = {"Software Installation": "2_installation",
                        "A Brief Introduction to the Bash Shell": "3_bash",
                        "Using Git and GitHub": "4_git-and-github",
                        "Introduction to Python for Data Analysis": "5_intro-to-python",
                        "Writing Scripts in Python": "6_python-scripts",
                        "Project Management": "7_project-management",
                        "Open Data": "8_open-data",
                        "The Brain Imaging Data Standards and Applications (BIDS)": "9_bids",
                        "Introduction to Data Visualization in Python": "10_python-data-visualization",
                        "Machine Learning Basics": "11_ml-basics",
                        "High-Performance Computing": "12_computing",
                        "Introduction to Deep Learning": "13_intro-to-dl",
                        "Machine Learning for Neuroimaging": "14_ml-for-neuroimaging",
                        "Applications of Deep Learning in Neuroimaging": "15_dl-for-neuroimaging",
                        "fMRI Connectivity": "16_functional-connectivity",
                        "fMRI Parcellation": "17_functional-parcellations",
                        "MNE-Python and EEG-BIDS": "18_mne-and-eeg-bids",
                        "Research Data Management Using DataLad": "19_datalad",
                        "Neuroimaging Data and File Structure in Python": "20_neuroimaging-in-python",
                        "Introduction to dMRI": "21_intro-to-dmri",
                        "Spinal Cord MRI": "22_spinal-cord-mri",
                        "Python Packaging": "23_python-packaging",
                        "Software Testing and Continuous Integration": "24_testing-and-integration",
                        "Containers": "25_containers"};

function markForMoveLater(sheet, cell, oldValue){
  function checkGrade(val){
    if (val === null || val === undefined){
        return false;
      }
    if (typeof val === "string" && val.trim().length === 0){
        return false;
      }

    if (typeof val === "number" && val >= 0 && val <= 5) {
      return true;
    } else {
      const num = Number(val);
      if (!Number.isNaN(num) && num >= 0 && num <= 5) {
        return true;
      }
    }
    return false;
  }

  const row = cell.getRow();
  const rangeToEdit = sheet.getRange(row, MOVE_STATUS, 1, 1);
  
  const currentValue = cell.getValue();
  if ((oldValue === undefined || oldValue === "") && checkGrade(currentValue)) {
    rangeToEdit.setValue("pending");
  }
  if (currentValue === undefined || currentValue === "") {
    rangeToEdit.clearContent();
  }

  //const school = sheet.getRange(row, SCHOOL_COLUMN, 1, 1).getValue();
  //const studentId = sheet.getRange(row, STUDENT_ID_COLUMN, 1, 1).getValue();
  //const name = sheet.getRange(row, STUDENT_NAME_COLUMN, 1, 1).getValue();
  //const moduleName = sheet.getRange(row, MODULE_NAME_COLUMN, 1, 1).getValue();
  //const time = sheet.getRange(row, TIMESTAMP_COLUMN, 1, 1).getValue();
  //const timeFormatted = Utilities.formatDate(time,
                                             //Session.getScriptTimeZone(),
                                             //"yyyy-MM-dd-HH-mm-ss");
  //const fileName = `${school}-${studentId}-${name}_${moduleName}_${timeFormatted}`;
  //console.log(fileName);
}


function handleEdit(e) {
  const sheet = e.source.getActiveSheet();
  //const lastRow = sheet.getLastRow();
  const cell = e.range;
  const column = cell.getColumn();
  const row = cell.getRow();

  if (column !== GRADE || row === 1){
    return; 
  }

  const oldValue = e.oldValue;
  //const currentValue = cell.getValue(); //safer than e.value
  markForMoveLater(sheet, cell, oldValue);  
}


function editError(cell, errorMsg, sep="| ") {
  const val = cell.getValue();
  const valFormatted = (val == undefined || val == null) ? "" : val;
  if (val.includes(errorMsg)){
    return;
  }
  const newVal = (valFormatted === "") ? errorMsg : valFormatted + sep + errorMsg;
  cell.setValue(newVal);
}

//time trigger q12h
function moveFiles() {
  const START = Date.now();
  const MAX_MS = 5.5 * 60 * 1000; // ~5.5 min safety

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    //Console.log("Skipping this execution: another run holds the lock.");
    Logger.log("Skipping this execution: another run holds the lock.");
    return;
  }
  Logger.log("check point 1");
  try{


  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  //const sh = ss.getSheetByName("Form Responses 1");
  const lastRow = sheet.getLastRow();
  const moveStatuses = sheet.getRange(2, MOVE_STATUS, lastRow-1, 1).getValues().flat();
  const fileIds = sheet.getRange(2, FILE_ID_COLUMN, lastRow-1, 1).getValues().flat();
  const destinations = sheet.getRange(2, MODULE_FOLDER_COLUMN, lastRow-1, 1).getValues().flat();
  Logger.log("check point 2");
  //console.log(moveStatuses);
  //console.log(fileIds);
  //console.log(destinations);

  //const indices = moveStatuses.reduce((acc, val, idx) => {
    //if (val === "pending") {
      //acc.push(idx);
    //}
    //return acc;
  //}, [])
  //console.log(indices);
  //Logger.log(indices);
  //if (indices.length === 0) {
    //return;
  //}
  for (let i = 0; i < moveStatuses.length; i++) {
  if (Date.now() - START > MAX_MS) {
    //console.log("Stopping early to avoid timeout; will continue next run.");
    Logger.log("Stopping early to avoid timeout; will continue next run.");
    return;
  }
  
  const status = moveStatuses[i];
  if (status !== "pending") {
    continue;
  }

    let file = null;
    let dest = null;

    if (fileIds[i] === "" || fileIds[i] == null) {
      const rangeToEdit = sheet.getRange(i+2, ERROR_COLUMN, 1, 1);
      editError(rangeToEdit, "missing-file-id");
    } else {
      try {
        file = DriveApp.getFileById(fileIds[i]);
      } catch (error) {
        //console.log(error);
        Logger.log(error);
      }    
    }

    if (destinations[i] === "" || destinations[i] == null){
      const rangeToEdit = sheet.getRange(i+2, ERROR_COLUMN, 1, 1);
      editError(rangeToEdit, "missing-folder-id");
    } else {
      try{
        dest = DriveApp.getFolderById(destinations[i]);
      } catch (error){
        //console.log(error);
        Logger.log(error);
      }   
    }

    if (file !== null && dest !== null){
      file.moveTo(dest);
      //console.log(`${file.getName()} moved to ${dest.getName()}`);
      Logger.log(`"${file.getName()}" moved to "${dest.getName()}"`);
      const statusUpdate = sheet.getRange(i+2, MOVE_STATUS, 1, 1);
      statusUpdate.setValue("complete");
      const clearError = sheet.getRange(i+2, ERROR_COLUMN, 1, 1);
      clearError.clearContent();
    }
  }


  } finally {
  lock.releaseLock();
}
}
