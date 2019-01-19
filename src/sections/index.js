const {SectionCode} = require('./section');
const {TypeSection} = require('./type');
const {ImportSection} = require('./import');
const {FunctionSection} = require('./function');
const {GlobalSection} = require('./global');
const {ExportSection} = require('./export');
const {ElementSection} = require('./element');
const {CodeSection} = require('./code');
const {DataSection} = require('./data');

const SectionClasses = require('./classes');

SectionClasses.set(SectionCode.TYPE, TypeSection);
SectionClasses.set(SectionCode.IMPORT, ImportSection);
SectionClasses.set(SectionCode.FUNCTION, FunctionSection);
SectionClasses.set(SectionCode.GLOBAL, GlobalSection);
SectionClasses.set(SectionCode.EXPORT, ExportSection);
SectionClasses.set(SectionCode.ELEMENT, ElementSection);
SectionClasses.set(SectionCode.CODE, CodeSection);
SectionClasses.set(SectionCode.DATA, DataSection);
