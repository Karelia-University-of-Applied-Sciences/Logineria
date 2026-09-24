export const NODE_TYPES = {
    INPUT: {
        type: 'INPUT',
        inputs: {'in1': 0}
    },
    OUTPUT: {
        type: 'OUTPUT',
        outputs: {'out': 0}
    },
    AND: {
        type: 'AND',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    },
    OR: {
        type: 'OR',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    },
    NOT: {
        type: 'NOT',
        inputs: {'in1': 0},
        outputs: {'out': 0},
    },
    NAND: {
        type: 'NAND',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    },
    NOR: {
        type: 'NOR',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    },
    XOR: {
        type: 'XOR',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    },
    XNOR: {
        type: 'XNOR',
        inputs: {'in1': 0, 'in2': 0},
        outputs: {'out': 0},
    }
};