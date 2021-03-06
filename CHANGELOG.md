# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.4 2020-04-07

- Updated the default API renderer. It should not have thrown an error in the notFound function. 

## 2.0.3 2020-01-08

- Added getFile resource decorator for file download API calls.

## 2.0.1 2019-10-26

### Changed

- Renamed unexpectedError to fatalError in the ResourceRenderer interface.

## 2.0.0 2019-10-26

### Changed

- Renamed several types and changed some object structures.

## 1.0.1 2019-10-25

### added

- ResourceUnauthorized added to resource exceptions

## 1.0.0 2019-10-18

### added

- Resource generator decorator to be used on classes/methods. Initial commit of code. 