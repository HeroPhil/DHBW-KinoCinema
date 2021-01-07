import { assert } from 'chai';
import { nanoid } from 'nanoid';
import { Screening } from '../../src/database/screenings';
import { checkIfSeatIsValidInScreening } from '../../src/logic/tickets';


describe("checkIfSeatIsValidInScreening", () => {


    it("should eval if a given number pair is in a specified range of a screening hall", () => {


        const screenings = [
            new Screening(nanoid(), {
                hall: {
                    data: {
                        rows: [
                            {count: 1},
                            {count: 2},
                            {count: 2}
                        ],
                        width: 5
                    }
                }
            }),
            new Screening(nanoid(), {
                hall: {
                    data: {
                        rows: [
                            {count: 1},
                            {count: 2},
                            {count: 3}
                        ],
                        width: 4
                    }
                }
            })
        ]


        const positiveCords = [
            {
                row: 1,
                seat: 1
            },
            {
                row: 4,
                seat: 2
            },
            {
                row: 2,
                seat: 4
            }
        ];


        const negativeCords = [
            {
                row: 0,
                seat: 0
            },
            {
                row: -1,
                seat: -1
            },
            {
                row: -1,
                seat: 1
            },
            {
                row: 1,
                seat: -1
            },
            {
                row: -1,
                seat: 8
            },
            {
                row: 8,
                seat: -1
            },
            {
                row: 8,
                seat: 1
            },
            {
                row: 1,
                seat: 8
            },
            {
                row: 8,
                seat: 8
            },
        ];

        const positiveExpected = { };
        const negativeExpected = {
            error: {
                message: "This seat does not exist!"
            }
        };


        for (const screening of screenings) {
            let actual;

            for (const cord of positiveCords) {
                actual = checkIfSeatIsValidInScreening(cord, screening);
                assert.deepEqual(actual, positiveExpected);
            }

            for (const cord of negativeCords) {
                actual = checkIfSeatIsValidInScreening(cord, screening);
                assert.deepEqual(actual, negativeExpected);
            }

        }

    });


});