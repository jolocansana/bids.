const listingValidation = require('../utils/listingValidation');

function dateValidation(startDate, endDate) {
    let today = new Date();

    let compareStartDate = new Date(startDate);
    let compareEndDate = new Date(endDate);

    if(compareStartDate < today) {
        return { error: true, details: 'Start date must be not earlier than today' };
    }

    if(compareEndDate < compareStartDate) {
        return { error: true, details: 'End date must be greater than start date' };
    }

    return true;
}

describe('Create New Listing', () => {

    it('When "name" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({ names: 1 });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "name" input is not a string, prompt "must be a string"', () => {
        const { error } = listingValidation({ name: 1 });

        expect(error.details[0].message).toContain('must be a string')
    });

    it('When "name" input is not a string, prompt "not allowed to be empty"', () => {
        const { error } = listingValidation({ name: "" });

        expect(error.details[0].message).toContain('to be empty')
    });

    it('When "name" input length is more than 200 , prompt "less than or equal to"', () => {
        const { error } = listingValidation({
            name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        });

        expect(error.details[0].message).toContain('less than or equal to 200')
    });

    // 

    it('When "brand" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans"
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "brand" input is not a string, prompt "must be a string"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: 1
        });

        expect(error.details[0].message).toContain('must be a string')
    });

    it('When "brand" input is not a string, prompt "not allowed to be empty"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "",
        });

        expect(error.details[0].message).toContain('to be empty')
    });

    it('When "brand" input length is less than 2 , prompt "2 characters long"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "a"
        });

        expect(error.details[0].message).toContain('at least 2 characters')
    });

    it('When "brand" input length is more than 200 , prompt "less than or equal to"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        });

        expect(error.details[0].message).toContain('less than or equal to 200')
    });

    //

    it('When "start price" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "start price" input is not a string, prompt "must be a number"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: "1a"
        });

        expect(error.details[0].message).toContain("type of 'number'")
    });

    it('When "start price" input is less than one, prompt "must be greater"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 0,
        });

        expect(error.details[0].message).toContain("must be greater")
    });

    //

    it('When "buy-out price" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "buy-out price" input is not a string, prompt "must be a number"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: "1a"
        });

        expect(error.details[0].message).toContain("type of 'number'")
    });

    it('When "buy-out" input is less than "start price" value, prompt "must be greater"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 99,
        });

        expect(error.details[0].message).toContain("must be greater")
    });

    // 


    it('When "description" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "description" input is not a string, prompt "must be a string"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: 1,
        });

        expect(error.details[0].message).toContain('must be a string')
    });

    it('When "description" input is not a string, prompt "not allowed to be empty"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "",
        });

        expect(error.details[0].message).toContain('to be empty')
    });

    it('When "description" input length is less than 5 , prompt "5 characters long"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "a"
        });

        expect(error.details[0].message).toContain('at least 5 characters')
    });

    it('When "description" input length is more than 200 , prompt "less than or equal to"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        });

        expect(error.details[0].message).toContain('less than or equal to 200')
    });

    //


    it('When "tags" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "tags" input is not a string, prompt "must be a string"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: 1,
        });

        expect(error.details[0].message).toContain('must be a string')
    });

    it('When "tags" input is not a string, prompt "not allowed to be empty"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "",
        });

        expect(error.details[0].message).toContain('to be empty')
    });

    it('When "tags" input length is less than 5 , prompt "5 characters long"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "a",
        });

        expect(error.details[0].message).toContain('at least 5 characters')
    });

    it('When "tags" input length is more than 200 , prompt "less than or equal to"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        });

        expect(error.details[0].message).toContain('less than or equal to 200')
    });

    //

    it('When "bid increase amount" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "bid increase amount" input is not a string, prompt "must be a number"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: "1am"
        });

        expect(error.details[0].message).toContain("type of 'number'")
    });

    

    it('When "bid increase amount" input is less than one, prompt "must be greater"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 0
        });

        expect(error.details[0].message).toContain("must be greater")
    });

    // 

    it('When "start date" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "start date" input is not a string, prompt "must be a number"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: "date"
        });

        expect(error.details[0].message).toContain("type of 'date'")
    });

    //

    it('When "end date" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "end date" input is not a string, prompt "must be a number"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
            endDate: "date"
        });

        expect(error.details[0].message).toContain("type of 'date'")
    });

    //

    it('When "product type" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
            endDate: new Date()
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "product type" input is not a string, prompt "must be one of the"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
            endDate: new Date(),
            productType: 'none'
        });

        expect(error.details[0].message).toContain("must be one of");
    });

    // 

    it('When "status" input is undefined, prompt "is required"', () => {
        const { error } = listingValidation({
            names: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
            endDate: new Date(),
            productType: 'books'
        });

        expect(error.details[0].message).toContain('is required')
    });

    it('When "status" input is not a string, prompt "must be one of the valid"', () => {
        const { error } = listingValidation({
            name: "Skinny Jeans",
            brand: "Oxygen",
            startPrice: 100,
            buyOutPrice: 3000,
            description: "This is a test description",
            tags: "Clothing - Men - Small",
            bidIncrease: 150,
            startDate: new Date(),
            endDate: new Date(),
            productType: 'none',
            productType: 'books',
            status: 'test'
        });

        expect(error.details[0].message).toContain("must be one of");
    });

    //

    it('When "start date" input is less than today, prompt "must be not earlier than today"', () => {
        const err = dateValidation(new Date("2015-01-01"), new Date());
        expect(err.details).toContain("must be not earlier than today");
    });

    it('When "end date" input is less than "start date" value, prompt "must be greater than start date"', () => {
        const err = dateValidation(new Date("2021-12-12"), new Date("2019-01-01"));
        expect(err.details).toContain("must be greater than start date");
    });


});