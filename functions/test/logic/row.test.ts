import { assert } from 'chai';
import { nanoid } from 'nanoid';
import { Screening } from '../../src/database/screenings';
import { countRowsOfScreening } from '../../src/logic/row';


describe("countRowsOfScreening", () => {

    it("should return count of rows from a given Screening", () => {


        const screeningA = new Screening(nanoid(), {
            hall: {
                data: {
                    rows: [
                        {count: 1},
                        {count: 2},
                        {count: 3}
                    ]
                }
            }
        });

        const screeningB = new Screening(nanoid(), {
            hall: {
                data: {
                    rows: [
                        {count: 4},
                        {count: 5}
                    ]
                }
            }
        });


        const actualA = countRowsOfScreening(screeningA);
        const actualB = countRowsOfScreening(screeningB);

        const expectedA = 6;
        const expectedB = 9;

        assert.equal(actualA, expectedA);
        assert.equal(actualB, expectedB);


    })

});