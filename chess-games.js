/**
 * Favorite games — add new entries by copying a block below.
 * Each game needs: id, title, year, event (optional), pgn
 * Games with nezhprodigy in [White] or [Black] auto-orient from your side.
 */
const FAVORITE_GAMES = [
  {
    id: "nezhprodigy-ceaserwawa-2022",
    title: "nezhprodigy v ceaserwawa",
    year: "2022",
    event: "Lichess Arena · Smith-Morra Gambit",
    pgn: `[Event "Chess is my career Arena"]
[Site "https://lichess.org/UipMbz3B"]
[Date "2022.12.01"]
[White "ceaserwawa"]
[Black "nezhprodigy"]
[Result "0-1"]
[ECO "B21"]
[Opening "Sicilian Defense: Smith-Morra Gambit"]

1. e4 c5 2. d4 cxd4 3. Qxd4 Nc6 4. Qe3 e5 5. Nc3 Nf6 6. Bd2 Be7 7. O-O-O O-O 8. f3 b5 9. Bxb5 Rb8 10. Bc4 Rxb2 11. Kxb2 Ba6 12. Bxa6 Ba3+ 13. Kxa3 Qa5+ 14. Kb2 Qxa6 15. Nge2 Rb8+ 16. Ka1 Nb4 17. Rb1 Nxc2 0-1`,
  },
  {
    id: "tal-larsen-1965",
    title: "Tal v Larsen",
    year: "1965",
    event: "Candidates · deciding game",
    pgn: `[Event "Candidates sf"]
[Site "Bled"]
[Date "1965.08.08"]
[Round "10"]
[White "Tal, Mikhail"]
[Black "Larsen, Bent"]
[Result "1-0"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nc3 d6 6. Be3 Nf6 7. f4 Be7 8. Qf3 O-O 9. O-O-O Qc7 10. Ndb5 Qb8 11. g4 a6 12. Nd4 Nxd4 13. Bxd4 b5 14. g5 Nd7 15. Bd3 b4 16. Nd5 exd5 17. exd5 f5 18. Rde1 Rf7 19. h4 Bb7 20. Bxf5 Rxf5 21. Rxe7 Ne5 22. Qe4 Qf8 23. fxe5 Rf4 24. Qe3 Rf3 25. Qe2 Qxe7 26. Qxf3 dxe5 27. Re1 Rd8 28. Rxe5 Qd6 29. Qf4 Rf8 30. Qe4 b3 31. axb3 Rf1+ 32. Kd2 Qb4+ 33. c3 Qd6 34. Bc5 Qxc5 35. Re8+ Rf8 36. Qe6+ Kh8 37. Qf7 1-0`,
  },
  {
    id: "botvinnik-tal-1960",
    title: "Botvinnik v Tal",
    year: "1960",
    event: "World Championship G6",
    pgn: `[Event "World Championship Match"]
[Site "Moscow"]
[Date "1960.03.15"]
[Round "6"]
[White "Botvinnik, Mikhail"]
[Black "Tal, Mikhail"]
[Result "0-1"]

1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15. Rb1 Nh5 16. Be3 Qb4 17. Qe2 Rc4 18. Rfc1 Rac8 19. Kh2 f5 20. exf5 Bxf5 21. Ra1 Nf4 22. gxf4 exf4 23. Bd2 Qxb2 24. Rab1 f3 25. Rxb2 fxe2 26. Rb3 Rd4 27. Be1 Be5 28. Kg1 Bf4 29. Ne2 Rxc1 30. Nxd4 Rxe1+ 31. Bf1 Be4 32. Ne2 Be5 33. f4 Bf6 34. Rb7 Bd3 35. Rc7 Ba2 36. Ra7 Bc4 37. Ra8+ Kf7 38. Ra7+ Ke8 39. Ra3 d5 40. Kf2 Bh4+ 41. Kg2 Kd6 42. Ng3 Bxg3 43. Bxc4 dxc4 44. Kxg3 Kd5 45. Ra7 c3 46. Rc7 Kd4 47. Rd7+ 0-1`,
  },
  {
    id: "nezhmetdinov-tal-1961",
    title: "Nezhmetdinov v Tal",
    year: "1961",
    event: "USSR Championship",
    pgn: `[Event "USSR-ch"]
[Site "Baku"]
[Date "1961.12.08"]
[Round "15"]
[White "Nezhmetdinov, Rashid"]
[Black "Tal, Mikhail"]
[Result "1-0"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be2 Nbd7 7. O-O a6 8. f4 Qc7 9. g4 b5 10. a3 Bb7 11. Bf3 Nc5 12. Qe2 e5 13. Nf5 g6 14. fxe5 dxe5 15. Nh6 Ne6 16. Bg2 Bg7 17. Rxf6 Bxf6 18. Nd5 Qd8 19. Qf2 Nf4 20. Bxf4 exf4 21. e5 Bxe5 22. Re1 f6 23. Nxf6+ Qxf6 24. Qd4 Kf8 25. Rxe5 Qd8 26. Rf5+ gxf5 27. Qxh8+ Ke7 28. Qg7+ Ke6 29. gxf5+ 1-0`,
  },
  {
    id: "nezhmetdinov-chernikov-1962",
    title: "Nezhmetdinov v Chernikov",
    year: "1962",
    event: "Russian Team Championship",
    pgn: `[Event "Chigorin Team Cup"]
[Site "Sochi"]
[Date "1962"]
[White "Nezhmetdinov, Rashid"]
[Black "Chernikov, Oleg"]
[Result "1-0"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 Ng4 9. Qxg4 Nxd4 10. Qh4 Qa5 11. O-O Bf6 12. Qxf6 Ne2+ 13. Kh1 Nxc3 14. bxc3 Qxc3 15. Rb1 Qb2 16. Be6 Rb8 17. Qh6 Bxe6 18. Qxh7+ Kf7 19. Qh5+ Kf8 20. Qh8+ Ke7 21. Qxg7 Rf8 22. Qg5+ Kd6 23. Qf4+ Kc6 24. Rc1+ Kb6 25. Qb4+ Ka6 26. Nc5+ 1-0`,
  },
  {
    id: "dubov-karjakin-2020",
    title: "Dubov v Karjakin",
    year: "2020",
    event: "Russian Championship",
    pgn: `[Event "RUS-ch Superfinal"]
[Site "Moscow"]
[Date "2020.12.16"]
[Round "11"]
[White "Dubov, Daniil"]
[Black "Karjakin, Sergey"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. b4 Bb6 7. e5 Ne4 8. Bd5 Nxc3 9. Nxc3 dxc3 10. Bg5 Ne7 11. O-O h6 12. Bh4 O-O 13. Re1 Qe8 14. Bb3 a5 15. Bf6 a4 16. Bc4 Ng6 17. Qd3 d5 18. exd6 Be6 19. Qxg6 fxg6 20. Rxe6 Qf7 21. Bxc3 Kh8 22. Re4 Qf5 23. Re7 Rg8 24. Bxg8 Rxg8 25. dxc7 Qc2 26. Be5 Bxf2+ 27. Kh1 Bb6 28. h3 Kh7 29. Re1 a3 30. Kh2 g5 31. Nd4 Qc4 32. Nf5 Qxb4 33. Rc1 Kg6 34. Rxg7+ Kxf5 35. Rxg8 Bxc7 36. Bxc7 Qb2 37. Rc5+ Ke4 38. Rd8 1-0`,
  },
  {
    id: "morphy-opera-1858",
    title: "Morphy v Duke & Count",
    year: "1858",
    event: "Opera House · Paris",
    pgn: `[Event "Paris"]
[Site "Paris"]
[Date "1858"]
[White "Morphy, Paul"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8 1-0`,
  },
];
