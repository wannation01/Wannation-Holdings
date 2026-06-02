// ============================================
// WANNATION MEDIA AI ENGINE
// Smart, Fast, Intelligent
// ============================================

class WANNationAI {
  constructor() {
    this.storage = localStorage;
    this.userPreferences = this.getPreferences();
    this.searchHistory = this.getSearchHistory();
    this.viewHistory = this.getViewHistory();
    this.initializeAI();
  }

  // ==================== AI INITIALIZATION ====================
  initializeAI() {
    console.log('🤖 WANnation AI Engine initialized');
    console.log('✅ Smart Search active');
    console.log('✅ Personal Recommendations active');
    console.log('✅ Auto-Categorization active');
  }

  // ==================== USER PREFERENCES ====================
  getPreferences() {
    const prefs = this.storage.getItem('wannation-prefs');
    return prefs ? JSON.parse(prefs) : {
      theme: 'night',
      language: 'en', // 'en' or 'tv' (Tshivenda)
      favoriteArtists: [],
      favoriteGenres: [],
      location: 'Pretoria'
    };
  }

  savePreferences(prefs) {
    this.storage.setItem('wannation-prefs', JSON.stringify(prefs));
    this.userPreferences = prefs;
  }

  // ==================== SMART SEARCH ====================
  async smartSearch(query, categories = ['all']) {
    if (!query || query.length < 2) return [];

    // Save search history
    this.addToSearchHistory(query);

    // AI-powered fuzzy matching
    const normalizedQuery = this.normalizeText(query.toLowerCase());
    const suggestions = [];

    // Search across all categories
    if (categories.includes('music') || categories.includes('all')) {
      suggestions.push(...await this.searchMusic(normalizedQuery));
    }
    if (categories.includes('news') || categories.includes('all')) {
      suggestions.push(...await this.searchNews(normalizedQuery));
    }
    if (categories.includes('artists') || categories.includes('all')) {
      suggestions.push(...await this.searchArtists(normalizedQuery));
    }
    if (categories.includes('business') || categories.includes('all')) {
      suggestions.push(...await this.searchBusiness(normalizedQuery));
    }

    // Sort by relevance score
    return this.sortByRelevance(suggestions, normalizedQuery);
  }

  normalizeText(text) {
    // Remove accents, normalize Tshivenda characters
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  // Fuzzy matching with typo tolerance
  fuzzyMatch(text, query) {
    const normalizedText = this.normalizeText(text);
    const normalizedQuery = this.normalizeText(query);

    // Exact match
    if (normalizedText === normalizedQuery) return 1.0;

    // Contains match
    if (normalizedText.includes(normalizedQuery)) return 0.9;

    // Fuzzy match (Levenshtein distance)
    const distance = this.levenshteinDistance(normalizedText, normalizedQuery);
    const maxLength = Math.max(normalizedText.length, normalizedQuery.length);
    return 1 - (distance / maxLength);
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  async searchMusic(query) {
    const songs = [
      { title: 'Sesi Ka Rose', artist: 'Makhadzi', category: 'music', score: 0 },
      { title: 'Sakha Wena', artist: 'Makhadzi', category: 'music', score: 0 },
      { title: 'Venda Mix 2025', artist: 'DJ Thohoyandou', category: 'music', score: 0 },
      { title: 'Baloi', artist: 'Makhadzi', category: 'music', score: 0 },
      { title: 'Tsini Ha Murena', artist: 'Mukwevho Sisters', category: 'music', score: 0 }
    ];

    return songs.map(song => ({
      ...song,
      score: Math.max(
        this.fuzzyMatch(song.title, query),
        this.fuzzyMatch(song.artist, query)
      )
    })).filter(song => song.score > 0.3);
  }

  async searchNews(query) {
    const news = [
      { title: 'Makhadzi Announces New Album', source: 'Music News', category: 'news', score: 0 },
      { title: 'Vhembe Business Growth', source: 'Business Post', category: 'news', score: 0 },
      { title: 'Venda Football Championship', source: 'Sports Daily', category: 'news', score: 0 }
    ];

    return news.map(item => ({
      ...item,
      score: Math.max(
        this.fuzzyMatch(item.title, query),
        this.fuzzyMatch(item.source, query)
      )
    })).filter(item => item.score > 0.3);
  }

  async searchArtists(query) {
    const artists = [
      { name: 'Makhadzi', genre: 'Amapiano', category: 'artists', score: 0 },
      { name: 'Una Rams', genre: 'Venda Pop', category: 'artists', score: 0 },
      { name: 'DJ Thohoyandou', genre: 'Venda House', category: 'artists', score: 0 }
    ];

    return artists.map(artist => ({
      ...artist,
      score: this.fuzzyMatch(artist.name, query)
    })).filter(artist => artist.score > 0.3);
  }

  async searchBusiness(query) {
    const businesses = [
      { name: 'Thohoyandou Restaurant', category: 'Restaurant', location: 'Thohoyandou', score: 0 },
      { name: 'Vhembe Car Dealership', category: 'Automotive', location: 'Louis Trichardt', score: 0 }
    ];

    return businesses.map(business => ({
      ...business,
      score: Math.max(
        this.fuzzyMatch(business.name, query),
        this.fuzzyMatch(business.category, query)
      )
    })).filter(business => business.score > 0.3);
  }

  sortByRelevance(results, query) {
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 results
  }

  // ==================== AI RECOMMENDATIONS ====================
  getRecommendations(type = 'all', limit = 5) {
    const recommendations = [];

    if (type === 'music' || type === 'all') {
      recommendations.push(...this.getMusicRecommendations());
    }
    if (type === 'news' || type === 'all') {
      recommendations.push(...this.getNewsRecommendations());
    }
    if (type === 'artists' || type === 'all') {
      recommendations.push(...this.getArtistRecommendations());
    }

    return recommendations.slice(0, limit);
  }

  getMusicRecommendations() {
    const favoriteGenres = this.userPreferences.favoriteGenres;
    const favoriteArtists = this.userPreferences.favoriteArtists;

    // If user likes Makhadzi, recommend similar artists
    if (favoriteArtists.includes('Makhadzi')) {
      return [
        { title: 'Sakha Wena', artist: 'Makhadzi', reason: 'Because you like Makhadzi' },
        { title: 'Venda Mix', artist: 'DJ Thohoyandou', reason: 'Similar style' }
      ];
    }

    // Default recommendations based on trending
    return [
      { title: 'Sesi Ka Rose', artist: 'Makhadzi', reason: '🔥 Trending now' },
      { title: 'Venda Worship', artist: 'Takesure Zamar', reason: 'Popular in your area' }
    ];
  }

  getNewsRecommendations() {
    const location = this.userPreferences.location;

    return [
      { title: `${location} Business News`, source: 'Local News', reason: `Near ${location}` },
      { title: 'Venda Music Updates', source: 'Music Daily', reason: 'Based on your interests' }
    ];
  }

  getArtistRecommendations() {
    return [
      { name: 'Makhadzi', genre: 'Amapiano', reason: '👑 Most popular' },
      { name: 'Una Rams', genre: 'Venda Pop', reason: 'Rising star' }
    ];
  }

  // ==================== SMART NEWS FEED ====================
  personalizeNewsFeed(newsArticles) {
    const interests = this.userPreferences.favoriteGenres || [];
    const location = this.userPreferences.location;

    return newsArticles
      .map(article => {
        let score = 0;

        // Boost if matches interests
        interests.forEach(interest => {
          if (article.title.toLowerCase().includes(interest.toLowerCase())) {
            score += 0.5;
          }
        });

        // Boost if local news
        if (article.location === location || article.location === 'Vhembe') {
          score += 0.3;
        }

        // Boost recent news
        const hoursOld = (Date.now() - article.timestamp) / (1000 * 60 * 60);
        if (hoursOld < 2) score += 0.2;
        else if (hoursOld < 24) score += 0.1;

        return { ...article, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // ==================== VIEW HISTORY ====================
  getViewHistory() {
    const history = this.storage.getItem('wannation-view-history');
    return history ? JSON.parse(history) : [];
  }

  addToViewHistory(item) {
    const history = this.getViewHistory();
    history.unshift({
      ...item,
      timestamp: Date.now()
    });

    // Keep only last 50 items
    if (history.length > 50) history.pop();

    this.storage.setItem('wannation-view-history', JSON.stringify(history));
  }

  // ==================== SEARCH HISTORY ====================
  getSearchHistory() {
    const history = this.storage.getItem('wannation-search-history');
    return history ? JSON.parse(history) : [];
  }

  addToSearchHistory(query) {
    const history = this.getSearchHistory();
    
    // Remove duplicate
    const filtered = history.filter(h => h.query !== query);
    filtered.unshift({ query, timestamp: Date.now() });

    // Keep only last 20
    if (filtered.length > 20) filtered.pop();

    this.storage.setItem('wannation-search-history', JSON.stringify(filtered));
  }

  getSearchSuggestions(input) {
    const history = this.getSearchHistory();
    return history
      .filter(h => h.query.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
      .map(h => h.query);
  }

  // ==================== TRENDING PREDICTOR ====================
  predictTrending(content) {
    return content.map(item => {
      let trendScore = 0;

      // Recent engagement
      const viewsLast24h = item.views || 0;
      trendScore += viewsLast24h * 0.3;

      // Engagement rate
      const engagementRate = (item.likes || 0) / (viewsLast24h || 1);
      trendScore += engagementRate * 0.4;

      // Trending velocity (is it growing?)
      const velocity = item.velocity || 0;
      trendScore += velocity * 0.3;

      return { ...item, trendScore };
    }).sort((a, b) => b.trendScore - a.trendScore);
  }

  // ==================== AI CHAT ASSISTANT ====================
  async chat(message) {
    const normalizedMsg = message.toLowerCase();

    // Simple rule-based AI (can be upgraded to real ML later)
    if (normalizedMsg.includes('hello') || normalizedMsg.includes('hi')) {
      return "👋 Ndi matsheloni! Welcome to WANnation Media! How can I help you today?";
    }

    if (normalizedMsg.includes('music') || normalizedMsg.includes('song')) {
      return "🎵 Would you like to hear the latest Venda music? I can show you the Top 20 charts or recommend songs based on your taste!";
    }

    if (normalizedMsg.includes('makhadzi')) {
      return "👑 Makhadzi is the Queen of Amapiano! Her latest song 'Sesi Ka Rose' is #1 on our charts. Would you like to listen?";
    }

    if (normalizedMsg.includes('job') || normalizedMsg.includes('work')) {
      return "💼 We have 16+ jobs and 8+ scholarships in Venda right
