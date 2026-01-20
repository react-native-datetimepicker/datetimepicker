#!/usr/bin/env node
/**
 * Post-install script to patch react-native-windows codegen files
 * to fix version mismatch with react-native 0.79.5
 * 
 * Run this script after yarn install:
 *   node scripts/patch-rnw-codegen.js
 */

const fs = require('fs');
const path = require('path');

const codegenDir = path.join(__dirname, '..', 'node_modules', 'react-native-windows', 'codegen');

// Patch rnwcoreJSI.h
const headerFile = path.join(codegenDir, 'rnwcoreJSI.h');
if (fs.existsSync(headerFile)) {
  let content = fs.readFileSync(headerFile, 'utf8');
  const originalLength = content.length;
  
  // Remove useEditTextStockAndroidFocusBehavior virtual declaration
  content = content.replace(/  virtual bool useEditTextStockAndroidFocusBehavior\(jsi::Runtime &rt\) = 0;\r?\n/g, '');
  
  // Remove useEditTextStockAndroidFocusBehavior Delegate implementation
  content = content.replace(/    bool useEditTextStockAndroidFocusBehavior\(jsi::Runtime &rt\) override \{[\s\S]*?instance_\);\s*\}\r?\n/g, '');
  
  if (content.length !== originalLength) {
    fs.writeFileSync(headerFile, content);
    console.log('✓ Patched rnwcoreJSI.h');
  } else {
    console.log('  rnwcoreJSI.h already patched or no changes needed');
  }
}

// Patch rnwcoreJSI-generated.cpp
const cppFile = path.join(codegenDir, 'rnwcoreJSI-generated.cpp');
if (fs.existsSync(cppFile)) {
  let content = fs.readFileSync(cppFile, 'utf8');
  const originalLength = content.length;
  
  // Remove the static function definition
  content = content.replace(/static jsi::Value __hostFunction_NativeReactNativeFeatureFlagsCxxSpecJSI_useEditTextStockAndroidFocusBehavior\(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value\* args, size_t count\) \{[\s\S]*?return static_cast<NativeReactNativeFeatureFlagsCxxSpecJSI \*>\(&turboModule\)->useEditTextStockAndroidFocusBehavior\(\s*rt\s*\);\s*\}\r?\n/g, '');
  
  // Remove the methodMap entry
  content = content.replace(/  methodMap_\["useEditTextStockAndroidFocusBehavior"\] = MethodMetadata \{0, __hostFunction_NativeReactNativeFeatureFlagsCxxSpecJSI_useEditTextStockAndroidFocusBehavior\};\r?\n/g, '');
  
  if (content.length !== originalLength) {
    fs.writeFileSync(cppFile, content);
    console.log('✓ Patched rnwcoreJSI-generated.cpp');
  } else {
    console.log('  rnwcoreJSI-generated.cpp already patched or no changes needed');
  }
}

console.log('Done.');
