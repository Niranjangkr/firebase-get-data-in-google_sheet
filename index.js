const { google } = require('googleapis')
const fs = require('fs').promises;
const { formatInTimeZone } = require('date-fns-tz');
// Replace with your Google Service Account credentials file path
const CREDENTIALS_FILE = 'credentials.json';

// Spreadsheet ID
const SPREADSHEET_ID = '1p-eoJBXP4SRIpIKasm6EGQQBZugXFT5cc7HnFm3twLc';

async function createSpreadsheet(data) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFilename: CREDENTIALS_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const users = data['__collections__']['users'];
    let count = 1

    for (const email in users) {
      const path_Name = users[email]["__collections__"]["chats"];
      for (const chatId in path_Name) {
        for (const messaageId in path_Name[chatId]["__collections__"]["messages"]) {
          const messaageId_path_Name = path_Name[chatId]["__collections__"]["messages"][messaageId]
          if (messaageId_path_Name.role === "user") {
            const messageText = messaageId_path_Name.content;

            // time
            const timestamp = messaageId_path_Name["createdAt"].value;
            const name = messaageId_path_Name["user"].name;
            const dateString = formatInTimeZone(
              new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000),
              'Asia/Kolkata',
              'yyyy-MM-dd'
            );

            const userData = {
              email,
              name,
              timestamp: dateString,
              description: messageText
            }

            // console.log(count + "NI ", userData);

            // call the createSpreadsheet funtion 
            let sheetTitle = email;
            await createSheet(sheets, sheetTitle, userData, count);
            count += 1;
            console.log(count, " done");
          }
        }
      }
    }
    console.log('Spreadsheet updated successfully!');

  } catch (error) {
    console.log("ERRORNICOde: ", error)
  }
}

async function createSheet(sheets, sheetTitle, userData, count) {
  try {
    const headerRow = ['srNo', 'created_at', 'name', 'email', 'description'];
    const values = [];

    const name = userData['name'];
    const email = userData['email'];
    const text = userData['description'];
    const dateString = userData['timestamp']
    const formattedDate = `${dateString} 00:00:00`;
    values.push([count, formattedDate, name, email, text]);

    const sheetValues = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetTitle}!A:A`
    });

    const rowCount = sheetValues.data.values ? sheetValues.data.values.length : 0;
    console.log("rowCount: ", rowCount);
    const range = `${sheetTitle}!A${rowCount + 1}`;

    let resource;
    if (rowCount === 0) {
      resource = { values: [headerRow, ...values] };
    } else {
      resource = { values }
    }

    const sheetsResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "RAW",
      resource
    })

  } catch (error) {
    console.log("ERROR: ", error)
  }

}

// Read your JSON data file (replace with your file path)
async function main() {
  try {
    const data = await fs.readFile('dataFavcyHive.json', 'utf-8');
    const jsonData = JSON.parse(data);

    await createSpreadsheet(jsonData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}


main();


// async function checkSheetExists(sheets, sheetTitle) {
//   const sheetList = await sheets.spreadsheets.get({
//     spreadsheetId: SPREADSHEET_ID,
//   });
//   // const sheetList = await sheets.spreadsheets.getSheets({
//   //     spreadsheetId: SPREADSHEET_ID,
//   // });
//   const sheetExists = sheetList.data.sheets.some(sheet => sheet.properties.title === sheetTitle);
//   return sheetExists;
// }
