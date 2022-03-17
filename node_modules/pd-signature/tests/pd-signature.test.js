import { TestUtils } from '../test-utils.js';
describe('pd-signature', () => {
  describe("sRoot", () => {
    it('Checks that component is attached to DOM', async () => {  
		let component = await TestUtils.render('div',{is:"pd-signature"});    
        expect(component.outerHTML).toEqual("<div is=\"pd-signature\"></div>");
    });
  }); 
  it('it should fail if appendToSave is missing', async () => {
      try {
        await await TestUtils.render('div',{is:"pd-signature"});
      } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
      }
  }); 
  it('it should fail if appendToSave=\"\"', async () => {
      try {
        await await TestUtils.render('div',{is:"pd-signature", appendToWhenSave:""});
      } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
      }
  });  
  describe("sRoot", () => {
    it('Checks that component is attached to DOM and has empty innerHTML and has all it\'s attributes empty', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature"});
        expect(component.innerHTML.includes("")).toBeTruthy();
		expect(component.getAttribute('hideOnExit')).toEqual(null);
		expect(component.getAttribute('appendToWhenSave')).toEqual(null);
		expect(component.getAttribute('buttonsColor')).toEqual(null);
		expect(component.getAttribute('buttonsBgColor')).toEqual(null);
		expect(component.getAttribute('lineWidth')).toEqual(null);
		expect(component.getAttribute('lineColor')).toEqual(null);
		expect(component.getAttribute('header')).toEqual(null);
		expect(component.getAttribute('footer')).toEqual(null);
    });
  }); 
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid appendToWhenSave attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", appendToWhenSave:"#output"});
        expect(component.getAttribute('appendToWhenSave')).toEqual("#output");
    });
  });
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid buttonsColor attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", buttonsColor:"#faaeaa"});
        expect(component.getAttribute('buttonsColor')).toEqual("#faaeaa");
    });
  });
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid buttonsBgColor attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", buttonsBgColor:"#850203"});
        expect(component.getAttribute('buttonsBgColor')).toEqual("#850203");
    });
  }); 
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid lineWidth attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", lineWidth:"3"});
        expect(component.getAttribute('lineWidth')).toEqual("3");
    });
  }); 
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid lineColor attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", lineColor:"#00ff00"});
        expect(component.getAttribute('lineColor')).toEqual("#00ff00");
    });
  });
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid header attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", header:"PD-SIGNATURE"});
        expect(component.getAttribute('header')).toEqual("PD-SIGNATURE");
    });
  });
  describe('sRoot', () => {
    it('Checks that component is attached to DOM and has a valid footer attribute.', async () => {
		let component = await TestUtils.render('div',{is:"pd-signature", footer:"A simple signature pad web component, for mobile and desktop devices!"});
        expect(component.getAttribute('footer')).toEqual("A simple signature pad web component, for mobile and desktop devices!");
    });
  }); 
});
describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present. This is a demo test to check that the response from the testing framework is ok.', () => {
		assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});




