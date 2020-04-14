import { Utils } from "./utils";


describe("indexWithin", function() {

	it("should be true", function() {
		expect(Utils.indexWithin([1], 0)).toBe(true);
	})

});

