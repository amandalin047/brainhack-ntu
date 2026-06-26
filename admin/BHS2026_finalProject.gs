FINAL_PROJECT_FOLDER_ID = "ID1";
SHEET_COPIES_FOLDER_ID = "ID2";
PITCH_RESPONSE_SHEET_ID = "ID3";
FINAL_RESPONSE_SHEET_ID = "ID4";
AGGREGATE_PITCH_SHEET_ID = "ID5";
AGGREGATE_FINAL_SHEET_ID = "ID6";

function copySheets(whichWay="to") {
    function regexName(fileName){
        let grader = fileName.split("_")[1];
        if (grader === "Some_Grader_1"){
            grader = "SomeGrader1";
        } else if (grader === "Some_Grader_2"){
            grader = "SomeGrader2";
        }
        return grader;
    }
    
    const folder = DriveApp.getFolderById(FINAL_PROJECT_FOLDER_ID);
    const copyFolder = DriveApp.getFolderById(SHEET_COPIES_FOLDER_ID);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS); // an iterator
    const copyFiles = copyFolder.getFilesByType(MimeType.GOOGLE_SHEETS);
    
    let sheetsInfo = [];
    let graderNameToSheetId = {};
    let existingNames = [];
    let file;
    while (files.hasNext()) {
        file = files.next()

        if (! file.getName().includes("(Responses)") && file.getName().includes("FinalProjectGrades")){
            sheetsInfo.push({
                "name": file.getName(),
                "id": file.getId(),
                "url": file.getUrl()
             })   
            existingNames.push(file.getName());
        }
    }
    //Logger.log(graderNameToSheetId);

    function getPitchAndFinalSheets (fileId) {
        const ss = SpreadsheetApp.openById(fileId);
        const sheets = ss.getSheets();

        let sheetNames = [];
        sheets.forEach((s) => {
            sheetNames.push(s.getName());
        })
        const pitchSheet = sheets[sheetNames.indexOf("pitch")];
        const finalSheet = sheets[sheetNames.indexOf("final")];

        return [pitchSheet, finalSheet];     
    }

    function copySheetContent (sheetsTo, sheetsFrom, mode) {
        const NTUTW_START_ROW = 2;
        const NTUSG_END_ROW = 31;
        const SCORE_COL_START = 2;
        const SCORE_COL_END = 9;

        let idx;
        if (mode == "pitch") {
            idx = 0;
        } else if (mode == "final") {
            idx = 1;
        }

        const sheetTo = sheetsTo[idx];
        const sheetFrom = sheetsFrom[idx];
        
        const rangeTo = sheetTo.getRange(NTUTW_START_ROW,
                                         SCORE_COL_START,
                                         NTUSG_END_ROW - NTUTW_START_ROW + 1,
                                         SCORE_COL_END - SCORE_COL_START + 1);
        rangeTo.clearContent();
        const data = sheetFrom.getRange(NTUTW_START_ROW,
                                        SCORE_COL_START,
                                        NTUSG_END_ROW - NTUTW_START_ROW + 1,
                                        SCORE_COL_END - SCORE_COL_START + 1)
                              .getValues();
        rangeTo.setValues(data);
    }

    let copyFile;
    while (copyFiles.hasNext()) {
      copyFile = copyFiles.next();
      if (existingNames.includes(copyFile.getName())) {
          graderNameToSheetId[regexName(copyFile.getName())] = copyFile.getId();
          let sheetsTo;
          let sheetsFrom;
          if (whichWay === "to"){
              sheetsTo = getPitchAndFinalSheets(copyFile.getId());
              const fromId = sheetsInfo[existingNames.indexOf(copyFile.getName())]["id"];
              sheetsFrom = getPitchAndFinalSheets(fromId);
              Logger.log(`File already exists! Clearing content and copying data into ${copyFile.getName()}`);
          } else if (whichWay === "back"){
              sheetsFrom = getPitchAndFinalSheets(copyFile.getId());
              const toId = sheetsInfo[existingNames.indexOf(copyFile.getName())]["id"];
              sheetsTo = getPitchAndFinalSheets(toId);
              Logger.log(`Syncing data back into ${copyFile.getName()} (the one they have editing rights to)`);
          }

          copySheetContent (sheetsTo, sheetsFrom, "pitch");
          copySheetContent (sheetsTo, sheetsFrom, "final");
          sheetsInfo.splice(existingNames.indexOf(copyFile.getName()), 1);
          existingNames = existingNames.filter(item => item !== copyFile.getName());
    }  
  }
      //Logger.log(graderNameToSheetId);
    
    if (whichWay === "to"){
      sheetsInfo.forEach ((info) => {
          let file = DriveApp.getFileById(info["id"]);
          let copied = file.makeCopy(file.getName(), copyFolder);
          graderNameToSheetId[regexName(file.getName())] = copied.getId();
          Logger.log(`Copying sheet ${file.getName()} to folder ${copyFolder.getName()}`);
      })
      //Logger.log(graderNameToSheetId);
      return graderNameToSheetId;
    }   
}

function getSchoolIndices (school, schoolStartEndDict){
        const start = schoolStartEndDict[school][0];
        const end = schoolStartEndDict[school][1];

        const nums = Array.from(
          {length: end - start + 1},
          (_, i) => start + i
        );
        return nums
    }


function structureFormData (mode = "pitch") {
    const GRADER = 2;
    const SCHOOL = 3;

    const DATA_START = 4;
    const DATA_END = 30;

    const NTUTW_START = 4;
    const NTUTW_END = 12;
    const NCUTW_START = 13;
    const NCUTW_END = 21;
    const NTUSG_START = 22;
    const NTUSG_END = 30;

    const schoolStartEndDict = {"ntutw": [NTUTW_START, NTUTW_END],
                               "ncutw": [NCUTW_START, NCUTW_END],
                               "ntusg": [NTUSG_START, NTUSG_END]}

    const NTUTW_INDICES = getSchoolIndices("ntutw", schoolStartEndDict);
    const NCUTW_INDICES = getSchoolIndices("ncutw", schoolStartEndDict);
    const NTUSG_INDICES = getSchoolIndices("ntusg", schoolStartEndDict);

    const schoolIndicesDict = {"ntutw": NTUTW_INDICES,
                               "ncutw": NCUTW_INDICES,
                               "ntusg": NTUSG_INDICES}

    let spreadSheetId;
    if (mode === "pitch") {
        spreadSheetId = PITCH_RESPONSE_SHEET_ID;
    } else if (mode === "final") {
        spreadSheetId = FINAL_RESPONSE_SHEET_ID;
    }

    const ss = SpreadsheetApp.openById(spreadSheetId)
    const sheet = ss.getActiveSheet();
    const lastRow = sheet.getLastRow();
    const graders = sheet.getRange(2, GRADER, lastRow - 1, 1)  //getRange(row, col, numRows, numCols)
                         .getValues()
                         .flat();
    const graderNames = [...new Set(graders)];
    //const schools = sheet.getRange(2, SCHOOL, lastRow - 1, 1)
                         //.getValues();
    const data = sheet.getRange(2, DATA_START, lastRow - 1, DATA_END - DATA_START + 1)
                      .getValues();

    //Logger.log(graders);

    function getGraderIndices(graderName) {
        let indices = [];
        let idx = 2;
        graders.forEach ((grader) => {
            if (grader === graderName) {
                indices.push(idx);
            }
            idx += 1;
        })
        return indices;
    }

    let graderIndicesDict = {};
    graderNames.forEach((graderName) => {
        const indices = getGraderIndices(graderName);
        graderIndicesDict[graderName] = indices;
    })

    function getGraderData(graderName) {
        const graderIndices = graderIndicesDict[graderName];
        const graderData = graderIndices.map(i => data[i - 2]);
        return graderData;
    }
    
    let graderDataDict = {};
    graderNames.forEach((graderName) => {
        const graderData = getGraderData(graderName);
        graderDataDict[graderName] = graderData;
    })
  
    function getSchoolDataPerGrader(graderName){
        const graderData = graderDataDict[graderName];
        let schoolDataDict = {};
        for (const [key, value] of Object.entries(schoolIndicesDict)) {
            const schoolData = graderData.map(row => value.map(j => row[j - DATA_START]));
            schoolDataDict[key] = schoolData;
        }
        return schoolDataDict;
    }

    let schoolDataPerGraderDict = {};
    graderNames.forEach((graderName) => {
        const schoolDataDict = getSchoolDataPerGrader(graderName);
        schoolDataPerGraderDict[graderName] = schoolDataDict;
    })
    return schoolDataPerGraderDict;
}


function syncToSheets (mode = "pitch") {
    const graderNameToSheetId = copySheets(whichWay="to");
    const NTUTW_START = 2;
    const NTUTW_END = 16;
    const NCUTW_START = 17;
    const NCUTW_END = 23;
    const NTUSG_START = 24;
    const NTUSG_END = 31;

    const schoolStartEndDict = {"ntutw": [NTUTW_START, NTUTW_END],
                                "ncutw": [NCUTW_START, NCUTW_END],
                                "ntusg": [NTUSG_START, NTUSG_END]}

    const schoolDataPerGraderDict = structureFormData (mode);

    for (const [graderName, schoolData] of Object.entries(schoolDataPerGraderDict)){
        const spreadSheetId = graderNameToSheetId[graderName];
        const ss = SpreadsheetApp.openById(spreadSheetId);
        const sheets = ss.getSheets();
        
        let sheetNames = [];
        sheets.forEach((s) => {
            sheetNames.push(s.getName());
        })

        const sheet = sheets[sheetNames.indexOf(mode)];
        for (const [school, startEnd] of Object.entries(schoolStartEndDict)){
            const data = schoolData[school];
            const numRows = data.length;

            let dataDict = {};
            for (let i = 0; i < numRows; i ++){
                dataDict[data[i][0]] = data[i].slice(1);  
            }
            
            let namesCol = sheet.getRange(startEnd[0], 1, startEnd[1] - startEnd[0] + 1, 1)
                                .getValues()
                                .flat();       
            for (const [name, row] of Object.entries(dataDict)){
                let idx = namesCol.indexOf(name);
                //Logger.log(name);
                //Logger.log(idx);
                //Logger.log(startEnd[0] + idx);
                if (idx >= 0) {
                    //Logger.log("write")
                    sheet.getRange(startEnd[0] + idx, 2, 1, row.length)
                         .setValues([row]);
                }     
            }
        }      
    }
}

function main () {
    syncToSheets ("pitch");
    copySheets(whichWay="back");
}


function aggregateDataForDownload(){
    const folder = DriveApp.getFolderById(SHEET_COPIES_FOLDER_ID);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);

    const pitchSS = SpreadsheetApp.openById(AGGREGATE_PITCH_SHEET_ID);
    const finalSS = SpreadsheetApp.openById(AGGREGATE_FINAL_SHEET_ID);

    function getData(ss, mode){
        const sheet = ss.getSheetByName(mode);
        const data = sheet.getDataRange()
                          .getValues();
        return data;
    }

    function insertData(mode, graderName, data){
        const dict = {"pitch": pitchSS,
                      "final": finalSS};
        const ss = dict[mode];
        let sheet;
        if (! ss.getSheetByName(graderName)){
            sheet = ss.insertSheet(graderName);
        } else {
            sheet = ss.getSheetByName(graderName);
        }
        sheet.getRange(1, 1, data.length, data[0].length)
             .clearContent()
             .setValues(data);
    }

    let j = 1;
    while (files.hasNext()){
        const file = files.next();
        const fileName = file.getName();
        if (fileName.startsWith("FinalProjectGrades")) {
            const ss = SpreadsheetApp.openById(file.getId());
            const pitchData = getData(ss, "pitch");
            const finalData = getData(ss, "final");
            
            //const graderName = fileName.split("_")[1];
            //insertData("pitch", graderName, pitchData);
            //insertData("final", graderName, finalData);
            insertData("pitch", `Grader ${j}`, pitchData);
            insertData("final", `Grader ${j}`, finalData);
            j += 1;
        }
    }

    if (pitchSS.getSheetByName("Sheet1")){
        pitchSS.deleteSheet(pitchSS.getSheetByName("Sheet1"));
    }
    if (finalSS.getSheetByName("Sheet1")){
        finalSS.deleteSheet(finalSS.getSheetByName("Sheet1"));
    }
  
}
