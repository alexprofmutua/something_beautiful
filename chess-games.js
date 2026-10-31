/**
 * Favorite games — add new entries by copying a block below.
 * Each game needs: id, title, year, event (optional), pgn
 * Personal usernames and former-name display are defined in chess-replay.js.
 */
export const FAVORITE_GAMES = [
  {
    id: "rinascita-nezhprodigy-2022",
    title: "Rinascita v nezhprodigy",
    year: "2022",
    event: "Lichess · Sicilian Defense: Bowdler Attack",
    pgn: `[Event "casual blitz game"]
[Site "https://lichess.org/game/RL4RVJtc"]
[Date "2022.10.04"]
[Round "-"]
[White "Rinascita"]
[Black "nezhprodigy"]
[Result "0-1"]
[GameId "RL4RVJtc"]
[UTCDate "2022.10.04"]
[UTCTime "21:31:33"]
[WhiteElo "2038"]
[BlackElo "1968"]
[Variant "Standard"]
[TimeControl "300+0"]
[ECO "B20"]
[Opening "Sicilian Defense: Bowdler Attack"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 c5 2. Bc4 { B20 Sicilian Defense: Bowdler Attack } e6 3. Nc3 Nc6 4. Nf3 a6 5. a4 Nge7 6. d4 cxd4 7. Nxd4 d5 8. Nxc6 bxc6 9. Ba2 d4 10. Ne2 e5 11. f4 f6 12. fxe5 fxe5 13. Ng3 Ng6 14. O-O Be7 15. Bf7+ Kd7 16. c4 Bf6 17. b4 Qe7 18. Bxg6 hxg6 19. b5 cxb5 20. cxb5 axb5 21. Ba3 b4 22. Bb2 Ba6 23. Rf2 d3 24. Rd2 Qc5+ 25. Kh1 Rxh2+ 26. Kxh2 Rh8+ 27. Nh5 Rxh5+ 28. Kg3 Qe3+ 29. Kg4 Qf4# { Black wins by checkmate. } 0-1`,
  },
  {
    id: "nezhprodigy-rinascita-2022",
    title: "nezhprodigy v Rinascita",
    year: "2022",
    event: "Lichess · Sicilian Defense",
    pgn: `[Event "casual blitz game"]
[Site "https://lichess.org/game/XXeIZAdD"]
[Date "2022.10.04"]
[Round "-"]
[White "nezhprodigy"]
[Black "Rinascita"]
[Result "1-0"]
[GameId "XXeIZAdD"]
[UTCDate "2022.10.04"]
[UTCTime "21:27:23"]
[WhiteElo "1968"]
[BlackElo "2038"]
[Variant "Standard"]
[TimeControl "300+0"]
[ECO "B50"]
[Opening "Sicilian Defense"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 { B50 Sicilian Defense } 4. Nxd4 a6 5. Bc4 g6 6. f4 Bg7 7. c3 e6 8. O-O Ne7 9. Qf3 O-O 10. Bb3 Nd7 11. Be3 Rb8 12. Kh1 b5 13. g4 Bxd4 14. cxd4 Nf6 15. Nc3 b4 16. Ne2 a5 17. Ng3 a4 18. Bxa4 e5 19. dxe5 dxe5 20. f5 gxf5 21. gxf5 Kh8 22. Bb3 Rb7 23. Bg5 Nc6 24. Bd5 Rc7 25. Rad1 Qe7 26. Nh5 Nd4 27. Rxd4 exd4 28. Bxf6+ Qxf6 29. Nxf6 Kg7 30. e5 Rc5 31. Rg1+ Kh8 32. Qh5 { Black resigns. } 1-0`,
  },
  {
    id: "alexalginique-rbosch1977-2020",
    title: "nezhprodigy v rbosch1977",
    year: "2020",
    event: "Lichess · Hyperaccelerated Dragon",
    pgn: `[Date "2020.11.03"]
[Round "-"]
[White "Alexalginique"]
[Black "rbosch1977"]
[Result "1-0"]
[GameId "PyDrlQtY"]
[UTCDate "2020.11.03"]
[UTCTime "15:19:18"]
[WhiteElo "1612"]
[BlackElo "1852"]
[WhiteRatingDiff "+230"]
[BlackRatingDiff "-10"]
[Variant "Standard"]
[TimeControl "600+0"]
[ECO "B27"]
[Opening "Sicilian Defense: Hyperaccelerated Dragon"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 c5 2. Nf3 g6 { B27 Sicilian Defense: Hyperaccelerated Dragon } 3. Bc4 Bg7 4. Nc3 a6 5. a4 e6 6. O-O Ne7 7. d4 cxd4 8. Nxd4 O-O 9. Nf3 Nbc6 10. Be3 f5 11. exf5 Nxf5 12. Bc5 d6 13. Ba3 Rf7 14. Re1 d5 15. Nxd5 exd5 16. Bxd5 Qf6 17. Re8+ Bf8 18. Rxf8+ Kg7 19. Rxf7+ { Black resigns. } 1-0`,
  },
  {
    id: "alexalginique-chicot-the-jester-2020",
    title: "nezhprodigy v chicot-the-jester",
    year: "2020",
    event: "Lichess · Evans Gambit",
    pgn: `[Event "casual rapid game"]
[Site "https://lichess.org/game/64pvszml"]
[Date "2020.11.26"]
[Round "-"]
[White "Alexalginique"]
[Black "chicot-the-jester"]
[Result "1-0"]
[GameId "64pvszml"]
[UTCDate "2020.11.26"]
[UTCTime "12:08:40"]
[WhiteElo "1808"]
[BlackElo "1889"]
[Variant "Standard"]
[TimeControl "600+1"]
[ECO "C51"]
[Opening "Italian Game: Evans Gambit, McDonnell Defense"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4?! { (0.25 → -0.48) Inaccuracy. d3 was best. } (4. d3 d6 5. O-O h6 6. c3 Nf6 7. h3 O-O 8. Re1 a5) 4... Bxb4 5. c3 Bc5 { C51 Italian Game: Evans Gambit, McDonnell Defense } 6. d4 exd4 7. O-O dxc3?? { (-0.49 → 1.28) Blunder. Bb6 was best. } (7... Bb6 8. cxd4 Na5 9. Bd3 d6 10. Nc3 Ne7 11. d5 O-O 12. h3) 8. Bxf7+ Kf8?! { (1.28 → 2.27) Inaccuracy. Kxf7 was best. } (8... Kxf7) 9. Bxg8 Rxg8 10. Nxc3?! { (3.39 → 2.22) Inaccuracy. Ng5 was best. } (10. Ng5 Rh8 11. e5 Qe7 12. Qf3+ Ke8 13. Nxc3 Rf8 14. Qh5+ g6 15. Qh4 Nxe5 16. Bd2 b6) 10... Be7?! { (2.22 → 2.97) Inaccuracy. d6 was best. } (10... d6 11. Ng5) 11. Nd5 d6 12. Nxe7?? { (3.70 → 1.59) Blunder. Ba3 was best. } (12. Ba3 g5) 12... Qxe7 13. Qe2? { (2.23 → 0.62) Mistake. e5 was best. } (13. e5 Nxe5) 13... Bg4 14. h3?? { (0.95 → -2.46) Blunder. Qd3 was best. } (14. Qd3) 14... Bh5?? { (-2.46 → 0.40) Blunder. Nd4 was best. } (14... Nd4 15. Qe3) 15. Qe3 Ne5?? { (0.86 → 3.35) Blunder. Ke8 was best. } (15... Ke8 16. Nd4) 16. Nxe5 Qxe5 17. Ba3? { (3.45 → 1.85) Mistake. Rb1 was best. } (17. Rb1 b6) 17... Bg6?! { (1.85 → 2.99) Inaccuracy. g5 was best. } (17... g5 18. Qd2) 18. Qb3? { (2.99 → 1.59) Mistake. Rae1 was best. } (18. Rae1) 18... b6?! { (1.59 → 2.21) Inaccuracy. Re8 was best. } (18... Re8 19. Qxb7) 19. Bb2 Qc5?? { (2.52 → 7.26) Blunder. Qxe4 was best. } (19... Qxe4 20. Rfe1) 20. Rac1 Qg5 21. f4? { (10.95 → 5.34) Mistake. Rxc7 was best. } (21. Rxc7) 21... Qd8?! { (5.34 → 7.32) Inaccuracy. Qe7 was best. } (21... Qe7 22. f5) 22. e5 d5 23. Ba3+ c5 24. f5 Bh5 25. f6?? { (9.24 → 3.78) Blunder. Rxc5 was best. } (25. Rxc5 bxc5 26. Bxc5+ Ke8 27. e6 Qc7 28. Qa4+ Kd8 29. e7+ Kc8 30. Qa6+ Qb7 31. Qe6+ Qd7) 25... g6?? { (3.78 → 12.73) Blunder. gxf6 was best. } (25... gxf6 26. Rce1 Bg6 27. Bc1 f5 28. Bh6+ Rg7 29. Qg3 Qe7 30. h4 Re8 31. h5 Bxh5 32. Rxf5+) 26. e6 Qd6 27. e7+? { (15.36 → 5.67) Mistake. Qe3 was best. } (27. Qe3) 27... Kf7 28. Bxc5 bxc5 29. e8=Q+ Raxe8 30. Qb7+ Kf8 31. Qxh7 g5? { (9.68 → Mate in 7) Checkmate is now unavoidable. Qe5 was best. } (31... Qe5 32. f7) 32. f7 Rg7 33. Qh8+ Ke7 34. Qxe8# { White wins by checkmate. } 1-0`,
  },
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
[Date "1960.03.26"]
[Round "6"]
[White "Botvinnik, Mikhail"]
[Black "Tal, Mikhail"]
[Result "0-1"]
[ECO "E69"]
[EventDate "1960.03.15"]
[PlyCount "92"]
[Source "https://www.olimpbase.org/ind-wcc/games/wc1960-wch.pgn"]

1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15. Rb1 Nh5 16. Be3 Qb4 17. Qe2 Rc4 18. Rfc1 Rac8 19. Kh2 f5 20. exf5 Bxf5 21. Ra1 Nf4 22. gxf4 exf4 23. Bd2 Qxb2 24. Rab1 f3 25. Rxb2 fxe2 26. Rb3 Rd4 27. Be1 Be5+ 28. Kg1 Bf4 29. Nxe2 Rxc1 30. Nxd4 Rxe1+ 31. Bf1 Be4 32. Ne2 Be5 33. f4 Bf6 34. Rxb7 Bxd5 35. Rc7 Bxa2 36. Rxa7 Bc4 37. Ra8+ Kf7 38. Ra7+ Ke6 39. Ra3 d5 40. Kf2 Bh4+ 41. Kg2 Kd6 42. Ng3 Bxg3 43. Bxc4 dxc4 44. Kxg3 Kd5 45. Ra7 c3 46. Rc7 Kd4 0-1`,
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
    event: "RSFSR Team Championship",
    pgn: `[Event "RSFSR Team Championship"]
[Site "Rostov-on-Don"]
[Date "1962.??.??"]
[Round "?"]
[White "Nezhmetdinov, Rashid"]
[Black "Chernikov, Oleg"]
[Result "1-0"]
[Source "https://www.lifemasteraj.com/old_af-dl/nezh-cher_r62.html"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 Ng4 9. Qxg4 Nxd4 10. Qh4 Qa5 11. O-O Bf6 12. Qxf6 Ne2+ 13. Nxe2 exf6 14. Nc3 Re8 15. Nd5 Re6 16. Bd4 Kg7 17. Rad1 d6 18. Rd3 Bd7 19. Rf3 Bb5 20. Bc3 Qd8 21. Nxf6 Be2 22. Nxh7+ Kg8 23. Rh3 Re5 24. f4 Bxf1 25. Kxf1 Rc8 26. Bd4 b5 27. Ng5 Rc7 28. Bxf7+ Rxf7 29. Rh8+ Kxh8 30. Nxf7+ Kh7 31. Nxd8 Rxe4 32. Nc6 Rxf4+ 33. Ke2 1-0`,
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
    id: "dubov-carlsen-2020",
    title: "Dubov v Carlsen",
    year: "2020",
    event: "FIDE Online Steinitz Memorial",
    pgn: `[Event "FIDE Steinitz Mem Open"]
[Site "chess24.com INT"]
[Date "2020.05.16"]
[Round "9.5"]
[White "Dubov, Daniil"]
[Black "Carlsen, Magnus"]
[Result "1-0"]
[WhiteTitle "GM"]
[BlackTitle "GM"]
[WhiteElo "2699"]
[BlackElo "2863"]
[ECO "E90"]
[Opening "King's Indian"]
[Variation "5.Nf3"]
[WhiteFideId "24126055"]
[BlackFideId "1503014"]
[EventDate "2020.05.15"]
[Source "https://theweekinchess.com/assets/files/pgn/steinitzmem20.pgn"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. d4 O-O 6. Bd3 Bg4 7. Be2 Nfd7 8. Be3 e5 9. d5 a5 10. Nd2 Bxe2 11. Qxe2 f5 12. f3 Na6 13. O-O-O Nac5 14. Kb1 a4 15. a3 Rf7 16. exf5 gxf5 17. g4 Qf6 18. gxf5 Qxf5+ 19. Ka2 Qc2 20. Rc1 Qd3 21. Qxd3 Nxd3 22. Rcg1 N7c5 23. Rg3 Kh8 24. Rhg1 Bf6 25. Nde4 Nxe4 26. Nxe4 Nf4 27. Bxf4 exf4 28. Rg4 Raf8 29. Kb1 b6 30. Kc2 Be7 31. Kd3 Bf6 32. R1g2 h6 33. Rg6 Bg7 34. Re6 Kh7 35. Nc3 Bxc3 36. Kxc3 Rg7 37. Rxg7+ Kxg7 38. Re7+ Kf6 39. Rxc7 Re8 40. Rd7 Re3+ 41. Kd4 Rxf3 42. Rxd6+ Kf5 43. Rxb6 Rf1 44. Rb8 Rd1+ 45. Kc5 f3 46. Rf8+ Ke4 47. d6 Rd2 48. Kc6 Rxh2 49. d7 Rd2 50. d8=Q Rxd8 51. Rxd8 h5 52. c5 h4 53. Kb5 f2 54. Rd1 1-0`,
  },
  {
    id: "dubov-svane-2019",
    title: "Dubov v Svane",
    year: "2019",
    event: "European Team Championship",
    pgn: `[Event "22nd European Teams"]
[Site "Batumi GEO"]
[Date "2019.10.31"]
[Round "7.1"]
[Board "4"]
[White "Dubov, Daniil"]
[Black "Svane, Rasmus"]
[Result "1-0"]
[WhiteTitle "GM"]
[BlackTitle "GM"]
[WhiteElo "2699"]
[BlackElo "2592"]
[ECO "D37"]
[Opening "QGD"]
[Variation "classical variation (5.Bf4)"]
[WhiteTeam "Russia"]
[BlackTeam "Germany"]
[WhiteFideId "24126055"]
[BlackFideId "4657101"]
[EventDate "2019.10.24"]
[Source "https://theweekinchess.com/assets/files/pgn/tcheur19.pgn"]

1. c4 e6 2. Nc3 d5 3. d4 Nf6 4. Nf3 Be7 5. Bf4 O-O 6. e3 b6 7. Qc2 Ba6 8. O-O-O dxc4 9. Ng5 Nc6 10. a3 g6 11. h4 Bd6 12. g3 Qe7 13. h5 e5 14. hxg6 hxg6 15. Bg2 exf4 16. Bxc6 fxg3 17. Kb1 Rad8 18. f4 Bc8 19. Rde1 Kg7 20. Nd5 Nxd5 21. Rh7+ Kg8 22. Rxf7 Rxf7 23. Qxg6+ Kf8 24. Qh6+ Rg7 25. Bxd5 Ke8 26. Qh5+ Kd7 27. Qh3+ Ke8 28. Qh5+ Kd7 29. Be6+ Kc6 30. Qf3+ Kb5 31. Bxc4+ Ka5 32. Qd5+ Bc5 33. b4+ Ka4 34. Qg2 Bxb4 35. Qc6+ Kxa3 36. Bb3 Bd7 37. Qc1+ Kxb3 38. Qc2+ Ka3 39. Qa2# 1-0`,
  },
  {
    id: "dubov-giri-2019",
    title: "Dubov v Giri",
    year: "2019",
    event: "Moscow FIDE Grand Prix",
    pgn: `[Event "Moscow FIDE Grand Prix"]
[Site "Moscow RUS"]
[Date "2019.05.18"]
[Round "1.2"]
[White "Dubov, Daniil"]
[Black "Giri, Anish"]
[Result "1-0"]
[WhiteTitle "GM"]
[BlackTitle "GM"]
[WhiteElo "2690"]
[BlackElo "2787"]
[ECO "D30"]
[Opening "QGD"]
[WhiteFideId "24126055"]
[BlackFideId "24116068"]
[EventDate "2019.05.17"]
[Source "https://theweekinchess.com/assets/files/pgn/moscowgp19.pgn"]

1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Bg5 dxc4 5. e4 b5 6. a4 c6 7. Nc3 b4 8. Nb1 Ba6 9. e5 h6 10. Bxf6 gxf6 11. exf6 c5 12. Nbd2 c3 13. bxc3 bxc3 14. Ne4 cxd4 15. Bb5+ Bxb5 16. axb5 Qd5 17. Qxd4 Qxb5 18. Nxc3 Bb4 19. O-O-O Qa5 20. Nb5 Na6 21. Qd7+ Kf8 22. Kb1 Ba3 23. Rd3 Qb4+ 24. Kc2 Qa4+ 25. Kd2 Bb4+ 26. Ke2 Kg8 27. Ne5 Qc2+ 28. Kf3 Rf8 29. Rhd1 h5 30. Qd4 Rh7 31. Qf4 Bc5 32. Nd4 Qa2 33. R1d2 Qd5+ 34. Ke2 Bb4 35. Ndc6 Qc5 36. Ne7+ Kh8 1-0`,
  },
  {
    id: "giri-dubov-2022",
    title: "Giri v Dubov",
    year: "2022",
    event: "World Rapid Championship",
    pgn: `[Event "World Rapid 2022"]
[Site "Almaty KAZ"]
[Date "2022.12.28"]
[Round "10.5"]
[White "Giri, Anish"]
[Black "Dubov, Daniil"]
[Result "0-1"]
[WhiteTitle "GM"]
[BlackTitle "GM"]
[WhiteElo "2764"]
[BlackElo "2708"]
[ECO "D73"]
[Opening "Neo-Gruenfeld, 5.Nf3"]
[WhiteFideId "24116068"]
[BlackFideId "24126055"]
[EventDate "2022.12.26"]
[Source "https://theweekinchess.com/assets/files/pgn/wrap22.pgn"]

1. Nf3 d5 2. g3 g6 3. Bg2 Bg7 4. d4 Nf6 5. c4 c6 6. cxd5 cxd5 7. Nc3 O-O 8. Ne5 Ne4 9. Nxe4 dxe4 10. Bxe4 Nc6 11. Nxc6 bxc6 12. Be3 Bh3 13. f3 Rb8 14. b3 Rb4 15. Kf2 f5 16. Bxc6 f4 17. gxf4 e5 18. dxe5 Qh4+ 19. Kg1 Rbxf4 20. Bxf4 Qxf4 21. Qd5+ Kh8 22. Qe4 Qg5+ 23. Kf2 Rf4 24. Qd5 Qh4+ 25. Ke3 Rf8 26. Qc5 Qf4+ 27. Kf2 Qh4+ 28. Ke3 Qg5+ 29. Kd3 Rd8+ 30. Kc4 Be6+ 31. Kb5 Bf8 32. Qc3 Rb8+ 33. Ka4 Qe7 34. a3 Bxb3+ 35. Qxb3 Rxb3 36. Kxb3 Qe6+ 0-1`,
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
