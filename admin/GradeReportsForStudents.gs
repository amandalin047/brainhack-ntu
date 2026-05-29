const RESPONSE_SHEET_ID = "response_sheet_id";
const GRADE_BOOKS_FOLDER_ID = "grade_books_folder_id";

const TIME_COL = 1;
const STUDENT_NAME_COL = 2;
const STUDENT_ID_COL = 4;
const MODULE_COL = 5;
const GRADE_COL = 8;
const TA_COL = 10;

const HEADER = ["Timestamp", "Student name", "Student ID",
                "Module", "Grade", "TA"];
const INDICES = [TIME_COL, STUDENT_NAME_COL, STUDENT_ID_COL,
                 MODULE_COL, GRADE_COL, TA_COL];

const ss = SpreadsheetApp.openById(RESPONSE_SHEET_ID);
const sheet = ss.getActiveSheet();
const folder = DriveApp.getFolderById(GRADE_BOOKS_FOLDER_ID);

function cleanString(s) {
        if (typeof s === "string") {
            return s.trim().toLowerCase();
        } else if (typeof s === "number" || typeof s === "bigint") {
            return String(s);
        } else {
            return s;
        }
    }

function getGradesForEachStudent() {
    const lastRow = sheet.getLastRow();
    const allData = sheet.getDataRange()
                         .getValues();

    const studentIdsArr = sheet.getRange(2, STUDENT_ID_COL, lastRow - 1, 1)
                               .getValues()
                               .flat();
  
    const studentIdsArrLower = studentIdsArr.map(s => cleanString(s));
    const uniqueStudentIds = [...new Set(studentIdsArrLower)];
    
    let studentDataDict = {};
    uniqueStudentIds.forEach((studentId) => {
        let studentData = [];
        for (let i = 1; i < lastRow; i ++){
            if (cleanString(allData[i][STUDENT_ID_COL - 1]) === studentId){
                studentData.push(INDICES.map(col => allData[i][col - 1]));
            } 
        }
        studentDataDict[studentId] = studentData;
    })
    //Logger.log(studentDataDict["some_student_id"]);
    return studentDataDict;
}


function writeToGradeBooks(){
    function write (ssFile, studentData) {
        const studentSS = SpreadsheetApp.openById(ssFile.getId());
        const studentSheet = studentSS.getActiveSheet();
        studentSheet.clear();
        studentSheet.getRange(1, 1, 1, HEADER.length)
                    .setValues([HEADER]);
        studentSheet.getRange(2, 1, studentData.length, HEADER.length)
                    .setValues(studentData);  
        console.log(`Data written into ${studentSS.getName()}`);
    } 
    
    const studentDataDict = getGradesForEachStudent();
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    const uniqueStudentIds = Object.keys(studentDataDict);

    let existingNames = [];
    while (files.hasNext()){
        const ssFile = files.next();
        if (uniqueStudentIds.includes(ssFile.getName())){
            existingNames.push(ssFile.getName());   
            write(ssFile, studentDataDict[ssFile.getName()]);
        }
    }

    uniqueStudentIds.forEach((studentId) => {
        if (! existingNames.includes(studentId)) {
            const studentSS = SpreadsheetApp.create(studentId);
            const ssFile = DriveApp.getFileById(studentSS.getId());
            ssFile.moveTo(folder);
            console.log(`Created spreadsheet ${ssFile.getName()} in folder ${folder.getName()}`);
            write(ssFile, studentDataDict[ssFile.getName()]);
        }
    })
}

function sendGradebooksToStudents(){
     const mapper = {
        "some_id1": "some_email1",
        "some_id2": "some_email2",
        "some_id3": "some_email3"
     }

    function appendEmailAddress(fileName){
        if (fileName.startsWith("r") || fileName.startsWith("d")){
            return fileName + ".some_suffix";
        } else if (fileName.startsWith("g") || fileName.startsWith("u")){
            return mapper[fileName];
        } else {
            return fileName + ".another_suffix"
        }
    }

    function renderEmailBody(studentName, fileUrl){
        const template = HtmlService.createTemplateFromFile("email_template");
        template.studentName = studentName;
        template.fileUrl = fileUrl;
        return template.evaluate()
                       .getContent();
    }

    function sendEmail(fileName, fileUrl) {
        const MASTER_SHEET_ID = "master_sheet_id";
        const NAME_COL = 1;
        const ID_COL = 2;
        const mastersheet = SpreadsheetApp.openById(MASTER_SHEET_ID)
                                          .getSheets()[2];
        const lastRow = mastersheet.getLastRow();
        const names = mastersheet.getRange(2, NAME_COL, lastRow - 1, 1)
                                 .getValues();
        const ids = mastersheet.getRange(2, ID_COL, lastRow - 1, 1)
                               .getValues()
                               .flat();
        idsLower = ids.map(s => cleanString(s));
        const dict = Object.fromEntries(
            idsLower.map((i, index) => [i, names[index][0]])
        );
        //Logger.log(dict);

        const sendTo = appendEmailAddress(fileName);
        const studentName = dict[fileName];
        Logger.log(studentName);
        MailApp.sendEmail({
            to: sendTo,
            subject: "BrainHack School 2026 Taiwan-Singapore: Module Assignment Submissions Grade Report",
            htmlBody: renderEmailBody(studentName, fileUrl),
            cc: "brainhacktwsg@gmail.com",
            //attachments: [DriveApp.getFileById("FILE_ID_HERE").getAs(MimeType.PDF)]
        });
        Logger.log(`Email sent to ${sendTo}`);
    }

    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    while (files.hasNext()){
        const ssFile = files.next();
        const fileName = ssFile.getName();
        const fileUrl = ssFile.getUrl();
        sendEmail(fileName, fileUrl);
    }
}
