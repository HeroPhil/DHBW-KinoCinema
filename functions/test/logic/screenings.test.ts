import { assert } from 'chai';
import { nanoid } from 'nanoid';
import { Ticket } from '../../src/database/tickets';
import { createEmptyHallSeatArray, markSeatsAsOccupied } from '../../src/logic/screenings';



describe("createEmptyHallSeatArray", () => {

    it("should return an 2D boolean array filled with false", () => {

        const seatCountA = 5;
        const rowCountA = 3;

        const seatCountB = 2;
        const rowCountB = 5;

        const actualA = createEmptyHallSeatArray(seatCountA, rowCountA);
        const actualB = createEmptyHallSeatArray(seatCountB, rowCountB);

        const expectedA = [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ];
        const expectedB = [
            [false, false],
            [false, false],
            [false, false],
            [false, false],
            [false, false]
        ];

        assert.deepEqual(actualA, expectedA);
        assert.deepEqual(actualB, expectedB);

    });
});

describe("markSeatAsOccupied", () => {

    it("should mark fields in a 2D array based on cords from Ticket[]", () => {

        const seats = [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ];

        const tickets = [
            new Ticket(nanoid(), {
                row: 1,
                seat: 1
            }),
            new Ticket(nanoid(), {
                row: 1,
                seat: 1
            }),
            new Ticket(nanoid(), {
                row: 2,
                seat: 1
            }),
            new Ticket(nanoid(), {
                row: 1,
                seat: 2
            }),
            new Ticket(nanoid(), {
                row: 3,
                seat: 5
            })
        ];

        const actual = markSeatsAsOccupied(seats, tickets);

        const expected = [
            [true, true, false, false, false],
            [true, false, false, false, false],
            [false, false, false, false, true]
        ];

        assert.deepEqual(actual, expected);

    })


});