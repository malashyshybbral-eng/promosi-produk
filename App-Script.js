const SPREADSHEET_ID = "SALIN_ID_SPREADSHEET_ANDA_DISINI";

function getConnection() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// Menangani Request GET
function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  try {
    if (action === "getProduk") {
      result = readData("Produk");
    } else if (action === "getPromosi") {
      result = readData("Promosi");
    } else if (action === "getAdmin") {
      result = readData("Admin");
    } else {
      return errorResponse("Action tidak valid");
    }
    return successResponse(result);
  } catch (err) {
    return errorResponse(err.toString());
  }
}

// Menangani Request POST
function doPost(e) {
  let postData;
  try {
    postData = JSON.parse(e.postData.contents);
  } catch(err) {
    return errorResponse("Format JSON tidak valid");
  }
  
  const action = postData.action;
  try {
    if (action === "addProduk") return successResponse(addData("Produk", postData.data));
    if (action === "addPromosi") return successResponse(addData("Promosi", postData.data));
    if (action === "updateProduk") return successResponse(updateData("Produk", "id_produk", postData.id, postData.data));
    if (action === "updatePromosi") return successResponse(updateData("Promosi", "id_promosi", postData.id, postData.data));
    if (action === "deleteProduk") return successResponse(deleteData("Produk", "id_produk", postData.id));
    if (action === "deletePromosi") return successResponse(deleteData("Promosi", "id_promosi", postData.id));
    
    return errorResponse("Action POST tidak valid");
  } catch (err) {
    return errorResponse(err.toString());
  }
}

// Fungsi CRUD Helper
function readData(sheetName) {
  const sheet = getConnection().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      if (row[index] instanceof Date) {
        obj[header] = Utilities.formatDate(row[index], Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

function addData(sheetName, dataObj) {
  const sheet = getConnection().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => dataObj[header] || "");
  sheet.appendRow(newRow);
  return "Data berhasil ditambahkan";
}

function updateData(sheetName, idColumnName, idValue, dataObj) {
  const sheet = getConnection().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idColumnName);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex].toString() === idValue.toString()) {
      headers.forEach((header, colIdx) => {
        if (dataObj[header] !== undefined && header !== idColumnName) {
          sheet.getRange(i + 1, colIdx + 1).setValue(dataObj[header]);
        }
      });
      return "Data berhasil diupdate";
    }
  }
  throw new Error("Data tidak ditemukan");
}

function deleteData(sheetName, idColumnName, idValue) {
  const sheet = getConnection().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idColumnName);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex].toString() === idValue.toString()) {
      sheet.deleteRow(i + 1);
      return "Data berhasil dihapus";
    }
  }
  throw new Error("Data gagal dihapus");
}

// CORS & Response Transformer
function successResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}