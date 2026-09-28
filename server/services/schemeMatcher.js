export const matchSchemes = (founder, allSchemes) => {
  // Step 1: Hard Filter
  const filtered = allSchemes.filter(scheme => {
    if (!scheme.isActive) return false;
    if (scheme.level === 'state' && scheme.state !== founder.state) return false;
    
    if (scheme.businessStageEligibility && scheme.businessStageEligibility.length > 0) {
      if (!scheme.businessStageEligibility.includes(founder.businessStage)) return false;
    }
    
    if (founder.teamSize < scheme.eligibilityCriteria.minTeamSize || founder.teamSize > scheme.eligibilityCriteria.maxTeamSize) return false;
    
    if (scheme.eligibilityCriteria.dpiitRequired && founder.dpiitRegistered !== 'yes') return false;
    
    const specialCategoryOnly = scheme.eligibilityCriteria.specialCategoryOnly;
    if (specialCategoryOnly && specialCategoryOnly.length > 0) {
      const isWomen = specialCategoryOnly.includes('women') && founder.womenLed;
      const isScSt = specialCategoryOnly.includes('sc_st') && founder.scStFounder;
      const isDiffAbled = specialCategoryOnly.includes('differently_abled') && founder.differentlyAbledFounder;
      
      if (!isWomen && !isScSt && !isDiffAbled) return false;
    }
    
    return true;
  });

  // Step 2: Scoring
  const scored = filtered.map(scheme => {
    let score = 0;
    
    // Sector tag overlap (40 points)
    if (scheme.sectorTags && scheme.sectorTags.includes(founder.industry)) {
      score += 40;
    }

    // Funding range fit (25 points)
    const reqMin = founder.fundingNeeded?.min || 0;
    const reqMax = founder.fundingNeeded?.max || 0;
    const schMin = scheme.fundingAmount?.min || 0;
    const schMax = scheme.fundingAmount?.max || Infinity;
    
    if (schMax >= reqMin && schMin <= reqMax) {
      score += 25;
    }
    
    // Stage match closeness (20 points)
    if (scheme.businessStageEligibility && scheme.businessStageEligibility.includes(founder.businessStage)) {
      score += 20;
    }
    
    // Special category bonus (15 points)
    if (founder.womenLed || founder.scStFounder || founder.differentlyAbledFounder) {
      score += 15;
    }

    return { ...scheme.toObject(), matchScore: score };
  });

  // Step 3: Rank & Shortlist
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 7);
};
