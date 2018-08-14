'use strict';

var path = require('path');
var expect = require('chai').expect;
var extractor = require('../lib/extract-controls');


describe("#extract-controls", function() {
    it('should extract control and application references', function () {
        const modules = extractor.extractControlsFromFileList(undefined,
            [path.join(__dirname, 'data/app-controls.html')]);
        expect(modules.length).to.equal(2);
        expect(modules.indexOf("app/my-application")).to.not.equal(-1);
        expect(modules.indexOf("app/my-control")).to.not.equal(-1);
    });
    it('should extract references from custom attributes', function () {
        const modules = extractor.extractControlsFromFileList(undefined,
            [path.join(__dirname, 'data/custom-attrs.html')],
            {
                attrs: ["data-my-component"]
            });
        expect(modules.length).to.equal(2);
        expect(modules.indexOf("app/my-application")).to.not.equal(-1);
        expect(modules.indexOf("app/my-component")).to.not.equal(-1);
    });
    it('should omit comment block', function () {
        const modules = extractor.extractControlsFromFileList(undefined,
            [path.join(__dirname, 'data/with-comment.html')]);
        expect(modules.indexOf("app/invalid-control")).to.equal(-1);
    });
    it('should omit module references in HTML text', function () {
        const modules = extractor.extractControlsFromFileList(undefined,
            [path.join(__dirname, 'data/reference-in-text.html')]);
        expect(modules.length).to.equal(0);
    });


});