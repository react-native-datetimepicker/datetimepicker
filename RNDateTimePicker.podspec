require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNDateTimePicker"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.license      = package['license']
  s.author       = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "10.0"
  s.source       = { :git => "https://github.com/react-native-community/datetimepicker", :tag => "v#{s.version}" }
  s.source_files = "ios/*.{h,m,swift}"
  s.requires_arc = true
  s.swift_version = '5.0'
  s.frameworks = 'UIKit'

  s.dependency "React-Core"
end
