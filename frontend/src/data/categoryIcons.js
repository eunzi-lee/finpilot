const categoryIcons = {
    // 지출
    식비: '🍽️',
    교통: '🚌',
    카페: '☕',
    쇼핑: '🛍️',
    생활: '🧺',
    주거: '🏠',
    통신: '📱',
    의료: '🏥',
    문화: '🎬',
    여행: '✈️',
    '기타 지출': '💸',

    // 수입
    급여: '💼',
    용돈: '💵',
    부수입: '💰',
    상여금: '🎁',
    이자: '🏦',
    '기타 수입': '🪙',
}

export function getCategoryIcon(category) {
    return categoryIcons[category] || '💳'
}

export default categoryIcons