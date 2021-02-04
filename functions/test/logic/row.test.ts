import { assert } from 'chai';
import { nanoid } from 'nanoid';
import { Screening } from '../../src/database/screenings';
import { countRowsOfScreening, getRowTypeIndex } from '../../src/logic/row';


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

describe("getRowTypeIndex", () => {

    it("should return index of the rowtype for a given row", () => {


        const screening = new Screening(nanoid(), {
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

        const actuals = [
            getRowTypeIndex(-2, screening),
            getRowTypeIndex(0, screening),
            getRowTypeIndex(3, screening),
            getRowTypeIndex(6, screening),
            getRowTypeIndex(123456, screening)
        ];

        const expected = [
            -1,
            0,
            1,
            2,
            -1
        ];

        actuals.forEach((actual, index) => {
            assert.equal(actual, expected[index]);
        });

    })

});