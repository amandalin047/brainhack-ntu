const NAME = "Student name", SCHOOL = "School", STUDENT_ID = "Student ID";
const MODULE = "Which module assignment are you submitting?";
const FILE = "Please upload your submission here.";

const ROOT_FOLDER_ID = "root_folder_id"; //students
const SPREADSHEET_ID = "spreadsheet_id"; //response spreadsheet
const FILE_ID_COLUMN = 11, MODULE_FOLDER_COLUMN =12;
const UPLOAD = "UPLOAD";

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

function getDestinationFolder(moduleName){
  const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  const moduleIter = rootFolder.getFoldersByName(moduleName);
  if (! moduleIter.hasNext()) {
    throw new Error(`${moduleName} folder not found...`);
  }
  const moduleFolder = moduleIter.next();

  const uploadIter = moduleFolder.getFoldersByName(UPLOAD);
  if (! uploadIter.hasNext()) {
    throw new Error("UPLOAD folder not found...");
  }
  const uploadFolder = uploadIter.next();
  const moveWrapper = {"moduleFolder": moduleFolder, "uploadFolder": uploadFolder}
  return moveWrapper;
}

function onFormSubmit(e) {
  const itemResponses = e.response.getItemResponses();
  const responseMap = {};
  itemResponses.forEach (r => {
    const question = r.getItem().getTitle();
    const answer = r.getResponse();
    responseMap[question] = answer;
  })
  let fileId = responseMap[FILE];
  if (Array.isArray(fileId)) {
    fileId = fileId[0];
  }
  const file = DriveApp.getFileById(fileId);

  const time = e.response.getTimestamp();
  const timeFormatted = Utilities.formatDate(time,
                                             Session.getScriptTimeZone(),
                                             "yyyy-MM-dd-HH-mm-ss");
  const newFileName = `${responseMap[SCHOOL]}-${responseMap[STUDENT_ID]}-${responseMap[NAME]}_${responseMap[MODULE]}_${timeFormatted}`;
  console.log(newFileName);

  const moveWrapper = getDestinationFolder(moduleToFolder[responseMap[MODULE]]);
  const moduleFolder = moveWrapper["moduleFolder"];
  const uploadFolder = moveWrapper["uploadFolder"];
  console.log(uploadFolder.getId());
  const newFile = file.makeCopy(newFileName, uploadFolder);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  //const sh = ss.getSheetByName("Form Responses 1");
  const lastRow = sheet.getLastRow();
  const rangeToAddFileId = sheet.getRange(lastRow, FILE_ID_COLUMN, 1, 1);
  const rangeToAddmoduleFolderId = sheet.getRange(lastRow, MODULE_FOLDER_COLUMN, 1, 1); 
  rangeToAddFileId.setValue(newFile.getId());
  rangeToAddmoduleFolderId.setValue(moduleFolder.getId());
}

