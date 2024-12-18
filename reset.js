#!/usr/bin/env node

/**
 * Cursor Trial Reset Tool
 *
 * This script resets the device IDs in Cursor's configuration file to generate a new random device ID.
 *
 * Author: @tinnt1
 * Created: 18/Dec/2024
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Function to back up the file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backup created at: ${backupPath}`);
  }
}

// Function to reset Cursor device IDs
function resetCursorId() {
  const storageFile = path.join(
    require('os').homedir(),
    'Library',
    'Application Support',
    'Cursor',
    'User',
    'globalStorage',
    'storage.json'
  );

  const storageDir = path.dirname(storageFile);

  // Ensure the directory exists
  fs.mkdirSync(storageDir, { recursive: true });

  // Backup the existing storage file
  backupFile(storageFile);

  let data = {};

  // Read existing data if the file exists
  if (fs.existsSync(storageFile)) {
    try {
      const fileContent = fs.readFileSync(storageFile, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error("Error reading storage.json:", err.message);
    }
  }

  // Generate new IDs
  const machineId = crypto.randomBytes(32).toString('hex');
  const macMachineId = crypto.randomBytes(32).toString('hex');
  const devDeviceId = uuidv4();

  // Update the data
  data['telemetry.machineId'] = machineId;
  data['telemetry.macMachineId'] = macMachineId;
  data['telemetry.devDeviceId'] = devDeviceId;

  // Write back the updated data
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf-8');

  console.log("🎉 Device IDs have been successfully reset. The new device IDs are:\n");
  console.log(JSON.stringify(
    {
      machineId,
      macMachineId,
      devDeviceId,
    },
    null,
    2
  ));
}

// Export the function without running it
module.exports = { resetCursorId };
