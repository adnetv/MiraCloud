//this file is the main process (everything that deals with node) of electron
const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const fs = require('fs');

// Login part
ipcMain.on('getCredentials', (event, arg) => {
  //finds the folder with the credentials currently hardcoded.
  const homedir = require('os').homedir() +'/.aws/credentials';
  let file = fs.readFileSync(homedir,"utf8");
  file = file.match(/\=(.*)/g);
  file = [file[0].slice(2),file[1].slice(2)];
  event.returnValue = file;
})

// main process for activate electron app
let mainWindow;

function initializeWindow() {
  //when you create a new browser window you start a new render process 
  //Render process is part of the electron that deals with the front-end
  mainWindow = new BrowserWindow({});
  mainWindow.maximize(); // opens full screen window onClick
  // loading into render process in the index html (compiling webpack)
  mainWindow.loadFile(path.join(__dirname, './dist/index.html'));
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
  mainWindow = null; // when u close deletes window
  });
};

//  might be additional,does same operation with 'activate'
app.on('ready', initializeWindow);

app.on('window-all-closed', () => {
  //for mac computers to really quit the application
	// darwin is a codename for mac computers
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//do research on app on events!
app.on('activate', () => {
  if (mainWindow === null) {
    initializeWindow();
  }
});