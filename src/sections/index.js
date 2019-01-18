const {SectionCode} = require('./section');
const {TypeSection} = require('./type');
const {FunctionSection} = require('./function');
const {ExportSection} = require('./export');
const {CodeSection} = require('./code');

const SectionClasses = require('./classes');

SectionClasses.set(SectionCode.TYPE, TypeSection);
SectionClasses.set(SectionCode.FUNCTION, FunctionSection);
SectionClasses.set(SectionCode.EXPORT, ExportSection);
SectionClasses.set(SectionCode.CODE, CodeSection);
