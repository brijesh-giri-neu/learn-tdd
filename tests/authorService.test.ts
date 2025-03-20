import app from "../server";
import request from "supertest";
import Author from "../models/author";

describe("Verify GET /authors   ", () => {
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it("should return a sorted list of authors", async () => {
        const mockAuthorsData = [
            { family_name: "Orwell", first_name: "George", date_of_birth: new Date(1903, 5, 25), date_of_death: new Date(1950, 0, 21) },
            { family_name: "Austen", first_name: "Jane", date_of_birth: new Date(1775, 11, 16), date_of_death: new Date(1817, 6, 18) },
            { family_name: "Hemingway", first_name: "Ernest", date_of_birth: new Date(1899, 6, 21), date_of_death: new Date(1961, 6, 2) }
        ];
    
        // Mock function to return authors sorted by family_name with virtual properties
        Author.getAllAuthors = jest.fn().mockResolvedValue(
            [...mockAuthorsData]
                .sort((a, b) => a.family_name.localeCompare(b.family_name))
                .map(author => ({
                    //...author,
                    name: `${author.family_name}, ${author.first_name}`,
                    lifespan: `${author.date_of_birth ? author.date_of_birth.getFullYear() : ''}-${author.date_of_death ? author.date_of_death.getFullYear() : ''}`
                }))
        );

    
        const response = await request(app).get(`/authors`);
    
        expect(response.statusCode).toBe(200);
    
        // Expected sorted order
        const expectedSortedAuthors = [
            { name: "Austen, Jane", lifespan: "1775-1817" },
            { name: "Hemingway, Ernest", lifespan: "1899-1961" },
            { name: "Orwell, George", lifespan: "1903-1950" }
        ];
    
        expect(response.body).toEqual(expectedSortedAuthors);
    });
    
    

    it("should respond with `No authors found` message when database does not return authors", async () => {
        const mockAuthorsData: string[] = [];
        Author.getAllAuthors = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockAuthorsData);
        });
        const response = await request(app).get(`/authors`);
        expect(response.statusCode).toBe(200);
        expect(response.text).toStrictEqual(`No authors found`);
    }); 

    it("should respond with 500 if there is an error fetching the book", async () => {
        Author.getAllAuthors = jest.fn().mockRejectedValue(new Error("Database error"));
        const response = await request(app).get(`/authors`);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(`No authors found`);
        expect(consoleSpy).toHaveBeenCalled();
    }); 
});