const {SectionCode} = require('./section');
const {TypeSection} = require('./type');
const {FunctionSection} = require('./function');

const SectionClasses = require('./classes');

SectionClasses.set(SectionCode.TYPE, TypeSection);
SectionClasses.set(SectionCode.FUNCTION, FunctionSection);
