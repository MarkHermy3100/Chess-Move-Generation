
import { PieceRules } from "./PieceRules";
let test = {
    count: 0,
    isValidMove(turn: number, piece: number, board: number[][], whiteKing: number[], blackKing: number[],
        position: number[], aftPosition: number[], castlingRights: boolean[], enPassant: number[]): boolean {
        if (aftPosition[0] < 0 || aftPosition[0] > 7) {
            return false;
        }
        if (aftPosition[1] < 0 || aftPosition[1] > 7) {
            return false;
        }
        if (position[0] == aftPosition[0] && position[1] == aftPosition[1]) {
            return false;
        }
        if (turn * piece < 0) {
            return false;
        }
        if (board[aftPosition[0]][aftPosition[1]] * piece > 0) {
            return false;
        }
        switch (Math.abs(piece)) {
            case 9:
                if (!PieceRules.isReachableByKing(board, position, aftPosition, castlingRights, false)) {
                    return false;
                }
                break;
            case 8:
                if (!PieceRules.isReachableByQueen(board, position, aftPosition)) {
                    return false;
                }
                break;
            case 5:
                if (!PieceRules.isReachableByRook(board, position, aftPosition)) {
                    return false;
                }
                break;
            case 3:
                if (!PieceRules.isReachableByBishop(board, position, aftPosition)) {
                    return false;
                }
                break;
            case 2:
                if (!PieceRules.isReachableByKnight(position, aftPosition)) {
                    return false;
                }
                break;
            case 1:
                if (!PieceRules.isReachableByPawn(board, position, aftPosition, false)) {
                    if (Math.abs(position[1] - aftPosition[1]) != 1) {
                        return false;
                    }
                    if (position[0] - piece != aftPosition[0]) {
                        return false;
                    }
                    if (aftPosition[0] + piece != enPassant[0] || aftPosition[1] != enPassant[1]) {
                        return false;
                    }
                }
                break;
            default:
                return false;
        }
        if (piece > 0) {
            if (piece < 9) {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(board, position, aftPosition), whiteKing, false)) {
                    return false;
                }
            }
            else {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(board, position, aftPosition), aftPosition, false)) {
                    return false;
                }
            }
        }
        else {
            if (piece > -9) {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(board, position, aftPosition), blackKing, false)) {
                    return false;
                }
            }
            else {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(board, position, aftPosition), aftPosition, false)) {
                    return false;
                }
            }
        }
        return true;
    },

    dfs(depth: number, turn: number, board: number[][], whiteKing: number[], blackKing: number[],
        castlingRights: boolean[], enPassant: number[]): void {
        /*for (let i: number = 0; i < 8; i++) {
            let s: string = "";
            for (let j: number = 0; j < 8; j++) {
                if (board[i][j] >= 0) {
                    s += ' ';
                }
                s += board[i][j];
            }
            console.log(s);
        }
        console.log("\n");*/
        if (depth > 0) {
            return;
        }
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                if (board[i][j] * turn > 0) {
                    for (let aft_i: number = 0; aft_i < 8; aft_i++) {
                        for (let aft_j: number = 0; aft_j < 8; aft_j++) {
                            if (this.isValidMove(turn, board[i][j], board, whiteKing, blackKing, [i, j], [aft_i, aft_j],
                                castlingRights, enPassant)) {
                                if (depth == 0) {
                                    this.count++;
                                }
                                if (board[i][j] == 9) {
                                    if (j == 4 && aft_j == 6) {
                                        board = PieceRules.pseudoBoard(board, [7, 7], [7, 5]);
                                    }
                                    else if (j == 4 && aft_j == 2) {
                                        board = PieceRules.pseudoBoard(board, [7, 0], [7, 3]);
                                    }
                                    this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                    [aft_i, aft_j], blackKing, [false, castlingRights[1], false, castlingRights[3]], [-1, -1]);
                                    if (j == 4 && aft_j == 6) {
                                        board = PieceRules.pseudoBoard(board, [7, 5], [7, 7]);
                                    }
                                    else if (j == 4 && aft_j == 2) {
                                        board = PieceRules.pseudoBoard(board, [7, 3], [7, 0]);
                                    }
                                }
                                else if (board[i][j] == -9) {
                                    if (j == 4 && aft_j == 6) {
                                        board = PieceRules.pseudoBoard(board, [0, 7], [0, 5]);
                                    }
                                    else if (j == 4 && aft_j == 2) {
                                        board = PieceRules.pseudoBoard(board, [0, 0], [0, 3]);
                                    }
                                    this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                    whiteKing, [aft_i, aft_j], [castlingRights[0], false, castlingRights[2], false], [-1, -1]);
                                    if (j == 4 && aft_j == 6) {
                                        board = PieceRules.pseudoBoard(board, [0, 5], [0, 7]);
                                    }
                                    else if (j == 4 && aft_j == 2) {
                                        board = PieceRules.pseudoBoard(board, [0, 3], [0, 0]);
                                    }
                                }
                                else if (board[i][j] == 5) {
                                    if (i == 7 && j == 7) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, [false, castlingRights[1], castlingRights[2], castlingRights[3]], [-1, -1]);
                                    }
                                    else if (i == 7 && j == 0) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, [castlingRights[0], castlingRights[1], false, castlingRights[3]], [-1, -1]);
                                    }
                                }
                                else if (board[i][j] == -5) {
                                    if (i == 0 && j == 7) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, [castlingRights[0], false, castlingRights[2], castlingRights[3]], [-1, -1]);
                                    }
                                    else if (i == 0 && j == 0) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, [castlingRights[0], castlingRights[1], castlingRights[2], false], [-1, -1]);
                                    }
                                }
                                else if (board[i][j] == 1) {
                                    if (i == 6 && aft_i == 4) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [aft_i, aft_j]);
                                    }
                                    else if (aft_i == 0) {
                                        board[i][j] = 8;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = 5;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = 3;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = 2;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = 1;
                                    }
                                    else {
                                        if (aft_i + 1 == enPassant[0] && aft_j == enPassant[1]) {
                                            board[enPassant[0]][enPassant[1]] = 0;
                                        }
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        if (aft_i + 1 == enPassant[0] && aft_j == enPassant[1]) {
                                            board[enPassant[0]][enPassant[1]] = -board[i][j];
                                        }
                                    }
                                }
                                else if (board[i][j] == -1) {
                                    if (i == 1 && aft_i == 3) {
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [aft_i, aft_j]);
                                    }
                                    else if (aft_i == 7) {
                                        board[i][j] = -8;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = -5;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = -3;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = -2;
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        board[i][j] = -1;
                                    }
                                    else {
                                        if (aft_i - 1 == enPassant[0] && aft_j == enPassant[1]) {
                                            board[enPassant[0]][enPassant[1]] = 0;
                                        }
                                        this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                        whiteKing, blackKing, castlingRights, [-1, -1]);
                                        if (aft_i - 1 == enPassant[0] && aft_j == enPassant[1]) {
                                            board[enPassant[0]][enPassant[1]] = -board[i][j];
                                        }
                                    }
                                }
                                else {
                                    this.dfs(depth + 1, turn * -1, PieceRules.pseudoBoard(board, [i, j], [aft_i, aft_j]),
                                    whiteKing, blackKing, castlingRights, [-1, -1]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

/*test.dfs(-4, 1,
    [[-5,-2,-3,-8,-9,-3,-2,-5],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [ 0, 0, 0, 0, 0, 0, 0, 0],
     [ 0, 0, 0, 0, 0, 0, 0, 0],
     [ 0, 0, 0, 0, 0, 0, 0, 0],
     [ 0, 0, 0, 0, 0, 0, 0, 0],
     [ 1, 1, 1, 1, 1, 1, 1, 1],
     [ 5, 2, 3, 8, 9, 3, 2, 5]],
    [7, 4], [0, 4], [true, true, true, true], [-1, -1]);*/
/*test.dfs(-3, 1,
    [[-5, 0, 0, 0,-9, 0, 0,-5],
     [-1, 0,-1,-1,-8,-1,-3, 0],
     [-3,-2, 0, 0,-1,-2,-1, 0],
     [ 0, 0, 0, 1, 2, 0, 0, 0],
     [ 0,-1, 0, 0, 1, 0, 0, 0],
     [ 0, 0, 2, 0, 0, 8, 0,-1],
     [ 1, 1, 1, 3, 3, 1, 1, 1],
     [ 5, 0, 0, 0, 9, 0, 0, 5]],
    [7, 4], [0, 4], [true, true, true, true], [-1, -1]);*/

test.dfs(-1, 1,
        [[ 0, 0, 0, 0, 0, 0, 0, 0],
         [ 0, 0,-1, 0, 0, 0, 0, 0],
         [ 0, 0, 0,-1, 0, 0, 0, 0],
         [ 9, 1, 0, 0, 0, 0, 0,-5],
         [ 0, 5, 0, 0, 0,-1, 0,-9],
         [ 0, 0, 0, 0, 0, 0, 0, 0],
         [ 0, 0, 0, 0, 1, 0, 1, 0],
         [ 0, 0, 0, 0, 0, 0, 0, 0]],
        [3, 0], [4, 7], [false, false, false, false], [-1, -1]);

console.log(test.count);



//bugged

//r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -
