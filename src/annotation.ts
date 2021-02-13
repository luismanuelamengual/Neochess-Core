export enum Annotation {
    GOOD_MOVE = 1,
    POOR_MOVE,
    VERY_GOOD_MOVE,
    VERY_POOR_MOVE,
    SPECULATIVE_MOVE,
    QUESTIONABLE_MOVE,
    FORCED_MOVE,
    SINGULAR_MOVE,
    WORST_MOVE,
    DRAWISH_POSITION,
    EQUAL_CHANCES_QUIET_POSITION,
    EQUAL_CHANCES_ACTIVE_POSITION,
    UNCLEAR_POSITION,
    WHITE_HAS_A_SLIGHT_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_ADVANTAGE,
    WHITE_HAS_A_MODERATE_ADVANTAGE,
    BLACK_HAS_A_MODERATE_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_ADVANTAGE,
    WHITE_HAS_A_CRUSHING_ADVANTAGE,
    BLACK_HAS_A_CRUSHING_ADVANTAGE,
    WHITE_IS_IN_ZUGZWANG,
    BLACK_IS_IN_ZUGZWANG,
    WHITE_HAS_A_SLIGHT_SPACE_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_SPACE_ADVANTAGE,
    WHITE_HAS_A_MODERATE_SPACE_ADVANTAGE,
    BLACK_HAS_A_MODERATE_SPACE_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_SPACE_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_SPACE_ADVANTAGE,
    WHITE_HAS_A_SLIGHT_TIME_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_TIME__ADVANTAGE,
    WHITE_HAS_A_MODERATE_TIME_ADVANTAGE,
    BLACK_HAS_A_MODERATE_TIME_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_TIME_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_TIME_ADVANTAGE,
    WHITE_HAS_THE_INITIATIVE,
    BLACK_HAS_THE_INITIATIVE,
    WHITE_HAS_A_LASTING_INITIATIVE,
    BLACK_HAS_A_LASTING_INITIATIVE,
    WHITE_HAS_THE_ATTACK,
    BLACK_HAS_THE_ATTACK,
    WHITE_HAS_INSUFFICIENT_COMPENSATION_FOR_MATERIAL_DEFICIT,
    BLACK_HAS_INSUFFICIENT_COMPENSATION_FOR_MATERIAL_DEFICIT,
    WHITE_HAS_SUFFICIENT_COMPENSATION_FOR_MATERIAL_DEFICIT,
    BLACK_HAS_SUFFICIENT_COMPENSATION_FOR_MATERIAL_DEFICIT,
    WHITE_HAS_MORE_THAN_ADEQUATE_COMPENSATION_FOR_MATERIAL_DEFICIT,
    BLACK_HAS_MORE_THAN_ADEQUATE_COMPENSATION_FOR_MATERIAL_DEFICIT,
    WHITE_HAS_A_SLIGHT_CENTER_CONTROL_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_CENTER_CONTROL_ADVANTAGE,
    WHITE_HAS_A_MODERATE_CENTER_CONTROL_ADVANTAGE,
    BLACK_HAS_A_MODERATE_CENTER_CONTROL_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_CENTER_CONTROL_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_CENTER_CONTROL_ADVANTAGE,
    WHITE_HAS_A_SLIGHT_KINGSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_KINGSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_MODERATE_KINGSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_MODERATE_KINGSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_KINGSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_KINGSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_SLIGHT_QUEENSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_SLIGHT_QUEENSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_MODERATE_QUEENSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_MODERATE_QUEENSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_DECISIVE_QUEENSIDE_CONTROL_ADVANTAGE,
    BLACK_HAS_A_DECISIVE_QUEENSIDE_CONTROL_ADVANTAGE,
    WHITE_HAS_A_VULNERABLE_FIRST_RANK,
    BLACK_HAS_A_VULNERABLE_FIRST_RANK,
    WHITE_HAS_A_WELL_PROTECTED_FIRST_RANK,
    BLACK_HAS_A_WELL_PROTECTED_FIRST_RANK,
    WHITE_HAS_A_POORLY_PROTECTED_KING,
    BLACK_HAS_A_POORLY_PROTECTED_KING,
    WHITE_HAS_A_WELL_PROTECTED_KING,
    BLACK_HAS_A_WELL_PROTECTED_KING,
    WHITE_HAS_A_POORLY_PLACED_KING,
    BLACK_HAS_A_POORLY_PLACED_KING,
    WHITE_HAS_A_WELL_PLACED_KING,
    BLACK_HAS_A_WELL_PLACED_KING,
    WHITE_HAS_A_VERY_WEAK_PAWN_STRUCTURE,
    BLACK_HAS_A_VERY_WEAK_PAWN_STRUCTURE,
    WHITE_HAS_A_MODERATELY_WEAK_PAWN_STRUCTURE,
    BLACK_HAS_A_MODERATELY_WEAK_PAWN_STRUCTURE,
    WHITE_HAS_A_MODERATELY_STRONG_PAWN_STRUCTURE,
    BLACK_HAS_A_MODERATELY_STRONG_PAWN_STRUCTURE,
    WHITE_HAS_A_VERY_STRONG_PAWN_STRUCTURE,
    BLACK_HAS_A_VERY_STRONG_PAWN_STRUCTURE,
    WHITE_HAS_POOR_KNIGHT_PLACEMENT,
    BLACK_HAS_POOR_KNIGHT_PLACEMENT,
    WHITE_HAS_GOOD_KNIGHT_PLACEMENT,
    BLACK_HAS_GOOD_KNIGHT_PLACEMENT,
    WHITE_HAS_POOR_BISHOP_PLACEMENT,
    BLACK_HAS_POOR_BISHOP_PLACEMENT,
    WHITE_HAS_GOOD_BISHOP_PLACEMENT,
    BLACK_HAS_GOOD_BISHOP_PLACEMENT,
    WHITE_HAS_POOR_ROOK_PLACEMENT,
    BLACK_HAS_POOR_ROOK_PLACEMENT,
    WHITE_HAS_GOOD_ROOK_PLACEMENT,
    BLACK_HAS_GOOD_ROOK_PLACEMENT,
    WHITE_HAS_POOR_QUEEN_PLACEMENT,
    BLACK_HAS_POOR_QUEEN_PLACEMENT,
    WHITE_HAS_GOOD_QUEEN_PLACEMENT,
    BLACK_HAS_GOOD_QUEEN_PLACEMENT,
    WHITE_HAS_POOR_PIECE_COORDINATION,
    BLACK_HAS_POOR_PIECE_COORDINATION,
    WHITE_HAS_GOOD_PIECE_COORDINATION,
    BLACK_HAS_GOOD_PIECE_COORDINATION,
    WHITE_HAS_PLAYED_THE_OPENING_VERY_POORLY,
    BLACK_HAS_PLAYED_THE_OPENING_VERY_POORLY,
    WHITE_HAS_PLAYED_THE_OPENING_POORLY,
    BLACK_HAS_PLAYED_THE_OPENING_POORLY,
    WHITE_HAS_PLAYED_THE_OPENING_WELL,
    BLACK_HAS_PLAYED_THE_OPENING_WELL,
    WHITE_HAS_PLAYED_THE_OPENING_VERY_WELL,
    BLACK_HAS_PLAYED_THE_OPENING_VERY_WELL,
    WHITE_HAS_PLAYED_THE_MIDDLEGAME_VERY_POORLY,
    BLACK_HAS_PLAYED_THE_MIDDLEGAME_VERY_POORLY,
    WHITE_HAS_PLAYED_THE_MIDDLEGAME_POORLY,
    BLACK_HAS_PLAYED_THE_MIDDLEGAME_POORLY,
    WHITE_HAS_PLAYED_THE_MIDDLEGAME_WELL,
    BLACK_HAS_PLAYED_THE_MIDDLEGAME_WELL,
    WHITE_HAS_PLAYED_THE_MIDDLEGAME_VERY_WELL,
    BLACK_HAS_PLAYED_THE_MIDDLEGAME_VERY_WELL,
    WHITE_HAS_PLAYED_THE_ENDING_VERY_POORLY,
    BLACK_HAS_PLAYED_THE_ENDING_VERY_POORLY,
    WHITE_HAS_PLAYED_THE_ENDING_POORLY,
    BLACK_HAS_PLAYED_THE_ENDING_POORLY,
    WHITE_HAS_PLAYED_THE_ENDING_WELL,
    BLACK_HAS_PLAYED_THE_ENDING_WELL,
    WHITE_HAS_PLAYED_THE_ENDING_VERY_WELL,
    BLACK_HAS_PLAYED_THE_ENDING_VERY_WELL,
    WHITE_HAS_SLIGHT_COUNTERPLAY,
    BLACK_HAS_SLIGHT_COUNTERPLAY,
    WHITE_HAS_MODERATE_COUNTERPLAY,
    BLACK_HAS_MODERATE_COUNTERPLAY,
    WHITE_HAS_DECISIVE_COUNTERPLAY,
    BLACK_HAS_DECISIVE_COUNTERPLAY,
    WHITE_HAS_MODERATE_TIME_CONTROL_PRESSURE,
    BLACK_HAS_MODERATE_TIME_CONTROL_PRESSURE,
    WHITE_HAS_SEVERE_TIME_CONTROL_PRESSURE,
    BLACK_HAS_SEVERE_TIME_CONTROL_PRESSURE
}
