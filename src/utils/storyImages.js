export const STORY_IMGS = {
  "Medical":          "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&q=75",
  "Education":        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75",
  "Food & Nutrition": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=75",
  "Food":             "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=75",
  "Shelter":          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=75",
  "Water":            "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&q=75",
  "Orphan":           "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=75",
  "Emergency":        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=75",
  "Success Story":    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=75",
  "Press Release":    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=75",
  "Partnership":      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=75",
  "default":          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=75",
};

export const getStoryImg = (s) =>
  s.afterImg || s.beforeImg || STORY_IMGS[s.category] || STORY_IMGS["default"];
