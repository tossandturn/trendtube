/**
 * ============================================================
 * Comment Intelligence Module v1.0
 * YouTube Comment Analysis & Audience Insight Engine
 *
 * Provides:
 * - Question density analysis
 * - Keyword-based sentiment scoring
 * - Content gap detection from comments
 * - Audience expertise level estimation
 * - Engagement quality assessment
 *
 * Pure JS, no external dependencies, SSR-safe
 * ============================================================
 */

// ============================================
// Sentiment Lexicons
// ============================================

const POSITIVE_WORDS = new Set([
  'love', 'loved', 'loving', 'like', 'liked', 'liking', 'enjoy', 'enjoyed', 'enjoying',
  'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful', 'brilliant',
  'perfect', 'best', 'good', 'nice', 'cool', 'superb', 'outstanding', 'incredible',
  'helpful', 'useful', 'informative', 'clear', 'easy', 'simple', 'well', 'thanks',
  'thank', 'grateful', 'appreciate', 'appreciated', 'happy', 'glad', 'pleased',
  'impressed', 'inspiring', 'inspired', 'motivated', 'motivating', 'fun', 'funny',
  'hilarious', 'entertaining', 'engaging', 'fascinating', 'interesting', 'beautiful',
  'gorgeous', 'stunning', 'epic', 'legendary', 'masterpiece', 'quality', 'professional',
  'recommend', 'recommended', 'subscribed', 'subscribe', 'fan', 'favorite', 'favourite',
  'wow', 'omg', 'yay', 'yes', 'absolutely', 'definitely', 'totally', 'completely',
  'exactly', 'precisely', 'accurate', 'correct', 'right', 'true', 'real', 'genuine',
  'honest', 'authentic', 'trustworthy', 'reliable', 'solid', 'strong', 'powerful',
  'effective', 'efficient', 'quick', 'fast', 'smooth', 'clean', 'neat', 'organized',
  'detailed', 'thorough', 'comprehensive', 'complete', 'full', 'rich', 'deep',
  'valuable', 'worth', 'worthwhile', 'beneficial', 'productive', 'successful',
  'win', 'winning', 'victory', 'champion', 'champ', 'legend', 'goat', 'fire',
  'lit', 'dope', 'sick', 'insane', 'crazy', 'mad', 'wild', 'unreal', 'mindblowing',
  'mind-blowing', 'breathtaking', 'astonishing', 'remarkable', 'exceptional',
  'phenomenal', 'magnificent', 'marvelous', 'splendid', 'fabulous', 'terrific',
  'tremendous', 'extraordinary', 'genius', 'talented', 'skilled', 'expert',
  'pro', 'veteran', 'experienced', 'knowledgeable', 'wise', 'smart', 'clever',
  'brilliant', 'sharp', 'bright', 'intelligent', 'creative', 'innovative',
  'original', 'unique', 'special', 'rare', 'precious', 'golden', 'pure',
  'clean', 'fresh', 'new', 'updated', 'modern', 'current', 'relevant',
  'timely', 'on point', 'spot on', 'nailed it', 'crushed it', 'killed it',
  'slayed', 'destroyed', 'dominated', 'owned', 'rocked', 'ruled',
]);

const NEGATIVE_WORDS = new Set([
  'hate', 'hated', 'hating', 'dislike', 'disliked', 'disliking', 'annoying',
  'terrible', 'awful', 'horrible', 'bad', 'worst', 'worse', 'suck', 'sucks',
  'sucked', 'boring', 'dull', 'tedious', 'monotonous', 'repetitive', 'stupid',
  'dumb', 'idiotic', 'ridiculous', 'absurd', 'nonsense', 'rubbish', 'trash',
  'garbage', 'waste', 'useless', 'worthless', 'pointless', 'meaningless',
  'confusing', 'confused', 'confusion', 'unclear', 'vague', 'ambiguous',
  'misleading', 'deceptive', 'fake', 'false', 'wrong', 'incorrect', 'inaccurate',
  'mistake', 'error', 'bug', 'broken', 'fail', 'failed', 'failure', 'flop',
  'disappointing', 'disappointed', 'disappointment', 'sad', 'upset', 'angry',
  'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'frustrating',
  'aggravating', 'infuriating', 'outrageous', 'unacceptable', 'unfair',
  'biased', 'prejudiced', 'discriminatory', 'offensive', 'insulting',
  'disrespectful', 'rude', 'mean', 'cruel', 'harsh', 'brutal', 'violent',
  'aggressive', 'hostile', 'toxic', 'negative', 'pessimistic', 'cynical',
  'skeptical', 'doubtful', 'dubious', 'suspicious', 'questionable',
  'sketchy', 'shady', 'dodgy', 'sketch', 'scam', 'fraud', 'hoax',
  'lie', 'lying', 'liar', 'cheat', 'cheating', 'stolen', 'stole',
  'copy', 'copied', 'plagiarism', 'plagiarized', 'unoriginal', 'bland',
  'plain', 'basic', 'generic', 'cookie-cutter', 'formulaic', 'predictable',
  'cliche', 'cliched', 'overrated', 'overhyped', 'underwhelming',
  'lacking', 'missing', 'incomplete', 'unfinished', 'rough', 'messy',
  'sloppy', 'lazy', 'careless', 'negligent', 'unprofessional',
  'amateur', 'novice', 'beginner', 'rookie', 'weak', 'feeble',
  'fragile', 'shaky', 'unstable', 'unreliable', 'inconsistent',
  'erratic', 'chaotic', 'disorganized', 'mess', 'disaster', 'catastrophe',
  'nightmare', 'hell', 'painful', 'torture', 'suffering', 'struggle',
  'struggling', 'difficult', 'hard', 'tough', 'rough', 'challenging',
  'problem', 'issue', 'concern', 'worry', 'worried', 'anxious',
  'nervous', 'scared', 'afraid', 'fear', 'terrified', 'horrified',
  'shocked', 'appalled', 'disgusted', 'revolted', 'sickened',
  'nauseous', 'gross', 'creepy', 'weird', 'strange', 'odd',
  'awkward', 'uncomfortable', 'cringe', 'cringy', 'cringeworthy',
  'embarrassing', 'shameful', 'humiliating', 'degrading',
  'depressing', 'depressed', 'lonely', 'isolated', 'abandoned',
  'betrayed', 'cheated', 'robbed', 'ripped off', 'screwed',
  'wasted', 'lost', 'ruined', 'destroyed', 'damaged', 'broken',
  'dead', 'dying', 'kill', 'killed', 'murder', 'suicide',
  'never', 'nobody', 'nothing', 'nowhere', 'no one', 'none',
  'cant', 'cannot', 'couldnt', 'could not', 'wont', 'will not',
  'wouldnt', 'would not', 'shouldnt', 'should not', 'dont',
  'do not', 'doesnt', 'does not', 'didnt', 'did not', 'wasnt',
  'was not', 'werent', 'were not', 'isnt', 'is not', 'arent',
  'are not', 'hasnt', 'has not', 'havent', 'have not', 'hadnt',
  'had not', 'not', 'neither', 'nor', 'without', 'lack', 'lacks',
  'missing', 'absent', 'gone', 'removed', 'deleted', 'blocked',
  'banned', 'restricted', 'limited', 'insufficient', 'inadequate',
  'poor', 'mediocre', 'average', 'subpar', 'below', 'under',
  'less', 'fewer', 'small', 'tiny', 'little', 'short', 'brief',
  'quick', 'rushed', 'hasty', 'careless', 'sloppy', 'lazy',
]);

const QUESTION_WORDS = new Set([
  'what', 'how', 'why', 'when', 'where', 'who', 'whom', 'whose',
  'which', 'can', 'could', 'should', 'would', 'will', 'shall',
  'may', 'might', 'must', 'is', 'are', 'was', 'were', 'am',
  'does', 'do', 'did', 'has', 'have', 'had', 'can\'t', 'cannot',
  'couldn\'t', 'shouldn\'t', 'wouldn\'t', 'won\'t', 'isn\'t',
  'aren\'t', 'wasn\'t', 'weren\'t', 'doesn\'t', 'don\'t',
  'didn\'t', 'hasn\'t', 'haven\'t', 'hadn\'t',
]);

// Beginner vocabulary indicators (simple/common words)
const BEGINNER_INDICATORS = new Set([
  'beginner', 'newbie', 'noob', 'new', 'start', 'starting', 'started',
  'first time', 'just started', 'help', 'help me', 'how do i',
  'how to start', 'what is', 'explain', 'explain like', 'eli5',
  'simple', 'easy', 'basic', 'fundamental', 'introduction',
  'tutorial for beginners', 'step by step', 'for dummies',
  'dont understand', 'confused', 'lost', 'struggling',
]);

// Advanced vocabulary indicators (technical/complex words)
const ADVANCED_INDICATORS = new Set([
  'algorithm', 'analytics', 'api', 'backend', 'bandwidth', 'benchmark',
  'cache', 'callback', 'ci/cd', 'cloud', 'container', 'containerization',
  'cryptography', 'dataframe', 'database', 'debugging', 'deployment',
  'distributed', 'docker', 'encryption', 'framework', 'function',
  'graphql', 'infrastructure', 'kubernetes', 'latency', 'load balancing',
  'machine learning', 'microservices', 'middleware', 'neural network',
  'nosql', 'optimization', 'orchestration', 'pipeline', 'protobuf',
  'query', 'recursion', 'refactoring', 'regex', 'rest api', 'scalability',
  'schema', 'serverless', 'sharding', 'sql', 'ssh', 'ssl', 'tcp/ip',
  'threading', 'throughput', 'tls', 'token', 'virtualization', 'webhook',
  'websocket', 'yaml', 'json', 'xml', 'oauth', 'jwt', 'cors', 'csrf',
  'xss', 'sql injection', 'penetration testing', 'reverse engineering',
  'binary', 'hexadecimal', 'bitwise', 'compiler', 'interpreter',
  'assembly', 'firmware', 'kernel', 'driver', 'module', 'plugin',
  'extension', 'library', 'package', 'dependency', 'repository',
  'version control', 'git', 'merge', 'rebase', 'cherry-pick',
  'monorepo', 'polyrepo', 'architecture', 'design pattern',
  'singleton', 'factory', 'observer', 'mvc', 'mvvm', 'mvp',
  'solid principles', 'dry', 'kiss', 'yagni', 'tdd', 'bdd',
  'ddd', 'clean architecture', 'hexagonal', 'onion', 'microkernel',
  'event sourcing', 'cqrs', 'saga', 'outbox', 'inbox',
  'idempotency', 'eventual consistency', 'cap theorem', 'paxos',
  'raft', 'gossip protocol', 'consistent hashing', 'bloom filter',
  'hyperloglog', 'count-min sketch', 'trie', 'b-tree', 'b+ tree',
  'lsm tree', 'fractal tree', 'skip list', 'segment tree',
  'fenwick tree', 'suffix tree', 'suffix array', 'aho-corasick',
  'boyer-moore', 'kmp', 'rabin-karp', 'levenshtein',
  'dynamic programming', 'greedy', 'backtracking', 'branch and bound',
  'a*', 'dijkstra', 'bellman-ford', 'floyd-warshall', 'kruskal',
  'prim', 'topological sort', 'strongly connected components',
  'tarjan', 'kosaraju', '2-sat', 'max flow', 'min cut',
  'bipartite matching', 'hungarian', 'network simplex',
  'gradient descent', 'stochastic', 'adam', 'rmsprop', 'adagrad',
  'backpropagation', 'dropout', 'batch normalization', 'layer normalization',
  'attention', 'transformer', 'bert', 'gpt', 'llm', 'lstm', 'gru',
  'cnn', 'rnn', 'gan', 'vae', 'diffusion', 'clip', 'dall-e',
  'stable diffusion', 'midjourney', 'prompt engineering', 'fine-tuning',
  'rlhf', 'peft', 'lora', 'qlora', 'adapters', 'prefix tuning',
  'p-tuning', 'ia3', 'unsloth', 'vllm', 'tensorrt', 'onnx',
  'quantization', 'pruning', 'distillation', 'knowledge distillation',
  'model compression', 'edge deployment', 'federated learning',
  'differential privacy', 'homomorphic encryption', 'zkp',
  'zero knowledge', 'mpc', 'secure multi-party', 'tee', 'sgx',
  'confidential computing', 'enclave', 'attestation',
]);

// Intermediate vocabulary indicators
const INTERMEDIATE_INDICATORS = new Set([
  'component', 'state', 'props', 'hook', 'context', 'reducer',
  'middleware', 'routing', 'navigation', 'authentication',
  'authorization', 'validation', 'serialization', 'deserialization',
  'pagination', 'filtering', 'sorting', 'searching', 'indexing',
  'caching', 'memoization', 'lazy loading', 'code splitting',
  'tree shaking', 'bundling', 'transpiling', 'polyfill',
  'responsive', 'accessibility', 'a11y', 'i18n', 'l10n',
  'testing', 'unit test', 'integration test', 'e2e', 'mock',
  'stub', 'spy', 'fixture', 'snapshot', 'coverage', 'tdd',
  'refactor', 'extract', 'inline', 'rename', 'move', 'pull up',
  'push down', 'encapsulate', 'delegate', 'factory method',
  'builder', 'prototype', 'adapter', 'bridge', 'composite',
  'decorator', 'facade', 'flyweight', 'proxy', 'chain of responsibility',
  'command', 'iterator', 'mediator', 'memento', 'state pattern',
  'strategy', 'template method', 'visitor', 'dependency injection',
  'inversion of control', 'service locator', 'repository',
  'unit of work', 'specification', 'aggregate', 'entity',
  'value object', 'domain event', 'domain service', 'application service',
  'infrastructure', 'presentation', 'controller', 'view model',
  'dto', 'mapper', 'converter', 'validator', 'sanitizer',
  'interceptor', 'guard', 'pipe', 'filter', 'exception filter',
  'transform', 'serialization', 'deserialization', 'orm',
  'odm', 'active record', 'data mapper', 'identity map',
  'lazy loading', 'eager loading', 'n+1', 'query optimization',
  'index scan', 'index seek', 'full table scan', 'execution plan',
  'query hint', 'stored procedure', 'trigger', 'view', 'cursor',
  'transaction', 'isolation level', 'acid', 'base', 'two-phase commit',
  'saga pattern', 'compensating transaction', 'event-driven',
  'message queue', 'pub/sub', 'topic', 'exchange', 'binding',
  'routing key', 'dead letter', 'retry', 'circuit breaker',
  'bulkhead', 'timeout', 'fallback', 'rate limiting', 'throttling',
  'backpressure', 'load shedding', 'graceful degradation',
  'health check', 'readiness', 'liveness', 'startup probe',
  'metrics', 'logging', 'tracing', 'observability', 'telemetry',
  'dashboard', 'alerting', 'on-call', 'incident', 'postmortem',
  'blameless', 'slo', 'sla', 'sli', 'error budget', 'toil',
  'automation', 'infrastructure as code', 'terraform', 'pulumi',
  'cloudformation', 'ansible', 'puppet', 'chef', 'saltstack',
  'helm', 'kustomize', 'argocd', 'flux', 'spinnaker', 'jenkins',
  'github actions', 'gitlab ci', 'circleci', 'travis', 'drone',
  'tekton', 'concourse', 'buildkite', 'semaphore', 'teamcity',
  'bamboo', 'azure devops', 'aws codepipeline', 'google cloud build',
]);

const NEUTRAL_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall',
  'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
  'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'among', 'within', 'without', 'against', 'under',
  'over', 'behind', 'beyond', 'across', 'around', 'near',
  'off', 'out', 'up', 'down', 'away', 'back', 'forward',
  'together', 'apart', 'aside', 'along', 'about', 'regarding',
  'concerning', 'considering', 'despite', 'except', 'besides',
  'including', 'excluding', 'following', 'like', 'unlike',
  'plus', 'minus', 'times', 'divided', 'equals', 'and', 'or',
  'but', 'yet', 'so', 'for', 'nor', 'either', 'neither',
  'both', 'whether', 'although', 'though', 'while', 'whereas',
  'because', 'since', 'as', 'if', 'unless', 'until', 'till',
  'once', 'whenever', 'wherever', 'however', 'whatever',
  'whoever', 'whichever', 'moreover', 'furthermore', 'besides',
  'otherwise', 'instead', 'meanwhile', 'therefore', 'thus',
  'hence', 'consequently', 'accordingly', 'eventually',
  'finally', 'initially', 'originally', 'previously', 'lately',
  'recently', 'currently', 'now', 'today', 'tomorrow',
  'yesterday', 'soon', 'later', 'early', 'late', 'first',
  'second', 'third', 'last', 'next', 'previous', 'following',
  'subsequent', 'prior', 'former', 'latter', 'one', 'two',
  'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'hundred', 'thousand', 'million', 'billion',
]);

// ============================================
// Core Analysis Functions
// ============================================

/**
 * Analyze an array of comments for intelligence signals
 * @param {Array<{text: string, author?: string, likeCount?: number, publishedAt?: string}>} comments
 * @returns {{
 *   questionDensity: number,
 *   sentimentScore: number,
 *   contentGaps: string[],
 *   audienceLevel: 'beginner' | 'intermediate' | 'advanced',
 *   engagementQuality: string
 * }}
 */
export function analyzeCommentIntelligence(comments) {
  if (!Array.isArray(comments) || comments.length === 0) {
    return {
      questionDensity: 0,
      sentimentScore: 50,
      contentGaps: ['No comments available for analysis.'],
      audienceLevel: 'unknown',
      engagementQuality: 'no_data',
    };
  }

  const texts = comments
    .map(c => (typeof c === 'string' ? c : c.text || c.comment || c.snippet?.textDisplay || ''))
    .filter(Boolean);

  const questionDensity = calculateQuestionDensity(texts);
  const sentimentScore = calculateSentimentScore(texts);
  const contentGaps = extractContentGaps(texts);
  const audienceLevel = calculateAudienceExpertise(texts);
  const engagementQuality = assessEngagementQuality(comments, sentimentScore, questionDensity);

  return {
    questionDensity,
    sentimentScore,
    contentGaps,
    audienceLevel,
    engagementQuality,
  };
}

/**
 * Extract content gaps — recurring questions not answered in video
 * @param {string[]} commentTexts
 * @param {string} [videoTitle]
 * @param {string} [videoDescription]
 * @returns {string[]}
 */
export function extractContentGaps(commentTexts, videoTitle = '', videoDescription = '') {
  if (!Array.isArray(commentTexts) || commentTexts.length === 0) {
    return ['No comments available to extract content gaps.'];
  }

  const gaps = [];
  const combinedVideoText = (videoTitle + ' ' + videoDescription).toLowerCase();

  // Find question comments
  const questionComments = commentTexts.filter(isQuestion);
  const questionRatio = commentTexts.length > 0 ? questionComments.length / commentTexts.length : 0;

  // Extract specific question topics
  const topicPatterns = [
    { regex: /how (?:do|can|to|does|should|would|will) (?:i|you|we|one|someone) (\w+)/gi, label: 'How to $1' },
    { regex: /what (?:is|are|does|do|happens|should|would|will) (?:the |a |an )?(\w+)/gi, label: 'What is $1' },
    { regex: /why (?:is|are|does|do|did|would|should|can) (?:the |a |an )?(\w+)/gi, label: 'Why $1' },
    { regex: /when (?:is|are|does|do|did|should|will|would) (?:the |a |an )?(\w+)/gi, label: 'When $1' },
    { regex: /where (?:is|are|does|can|should|would|will) (?:the |a |an )?(\w+)/gi, label: 'Where $1' },
    { regex: /who (?:is|are|does|did|should|would|will|can) (?:the |a |an )?(\w+)/gi, label: 'Who $1' },
    { regex: /can (?:you|we|someone|anyone) (\w+)/gi, label: 'Can you $1' },
    { regex: /(?:tutorial|guide|example) (?:for|on|about) (\w+)/gi, label: '$1 tutorial/guide' },
    { regex: /(?:difference|compare|versus|vs) (?:between )?(\w+)/gi, label: 'Compare $1' },
    { regex: /(?:best|top|recommend|suggest) (\w+)/gi, label: 'Best $1' },
  ];

  const topicCounts = new Map();

  for (const comment of questionComments) {
    const lowerComment = comment.toLowerCase();
    for (const { regex, label } of topicPatterns) {
      let match;
      while ((match = regex.exec(lowerComment)) !== null) {
        const topic = label.replace('$1', match[1]);
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      }
    }
  }

  // Sort by frequency and filter for recurring topics (>= 2 mentions)
  const sortedTopics = [...topicCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedTopics.length > 0) {
    for (const [topic, count] of sortedTopics) {
      const isAddressed = combinedVideoText.includes(topic.toLowerCase().replace(/^(how to|what is|why|when|where|who|can you|compare|best)\s+/i, ''));
      if (!isAddressed) {
        gaps.push(`Recurring question: "${topic}" — mentioned ${count} times but not clearly addressed in the video.`);
      }
    }
  }

  // General gap signals
  if (questionRatio > 0.25) {
    gaps.push(`High question density (${(questionRatio * 100).toFixed(0)}%) — viewers are seeking clarifications not provided in the video.`);
  }

  if (questionRatio > 0.15 && questionRatio <= 0.25) {
    gaps.push('Moderate question density suggests some topics could use deeper explanation or follow-up content.');
  }

  // Check for requests for follow-up content
  const followUpPatterns = [
    /(?:make|do|create) (?:a |an )?(?:video|tutorial|guide|part \d|episode|series)/i,
    /(?:next|following|upcoming) (?:video|part|episode)/i,
    /(?:more|follow.up|sequel|continuation) (?:on|about|of)/i,
    /(?:cover|talk about|discuss) (?:more|next|also)/i,
  ];

  let followUpCount = 0;
  for (const comment of commentTexts) {
    if (followUpPatterns.some(p => p.test(comment))) followUpCount++;
  }

  if (followUpCount >= 3) {
    gaps.push(`Follow-up content requested ${followUpCount} times — strong signal for sequel or series potential.`);
  }

  // Check for confusion signals
  const confusionPatterns = [
    /(?:confused|confusing|lost|don't understand|dont understand|not clear|unclear)/i,
    /(?:too fast|too quick|slow down|go back|explain again)/i,
    /(?:what do you mean|what does that mean|i don't get it|i dont get it)/i,
  ];

  let confusionCount = 0;
  for (const comment of commentTexts) {
    if (confusionPatterns.some(p => p.test(comment))) confusionCount++;
  }

  if (confusionCount >= 3) {
    gaps.push(`Clarity issues detected (${confusionCount} comments) — consider simplifying explanations or adding visual aids.`);
  }

  if (gaps.length === 0) {
    gaps.push('No significant content gaps detected. Comments appear well-addressed by the video content.');
  }

  return gaps;
}

/**
 * Calculate audience expertise level based on vocabulary complexity
 * @param {string[]} commentTexts
 * @returns {'beginner' | 'intermediate' | 'advanced'}
 */
export function calculateAudienceExpertise(commentTexts) {
  if (!Array.isArray(commentTexts) || commentTexts.length === 0) {
    return 'unknown';
  }

  const allText = commentTexts.join(' ').toLowerCase();
  const words = tokenize(allText);

  let beginnerScore = 0;
  let intermediateScore = 0;
  let advancedScore = 0;

  // Check for explicit level indicators
  for (const indicator of BEGINNER_INDICATORS) {
    if (allText.includes(indicator)) beginnerScore += 3;
  }

  for (const indicator of INTERMEDIATE_INDICATORS) {
    if (allText.includes(indicator)) intermediateScore += 2;
  }

  for (const indicator of ADVANCED_INDICATORS) {
    if (allText.includes(indicator)) advancedScore += 2;
  }

  // Vocabulary complexity analysis
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);
  const uniqueWords = new Set(words);
  const lexicalDiversity = uniqueWords.size / Math.max(words.length, 1);

  // Adjust scores based on linguistic features
  if (avgWordLength > 6.5) advancedScore += 2;
  else if (avgWordLength > 5.5) intermediateScore += 1;
  else if (avgWordLength < 4.5) beginnerScore += 1;

  if (lexicalDiversity > 0.7) advancedScore += 1;
  else if (lexicalDiversity > 0.5) intermediateScore += 1;
  else beginnerScore += 1;

  // Technical term density
  const technicalTerms = words.filter(w => ADVANCED_INDICATORS.has(w) || INTERMEDIATE_INDICATORS.has(w));
  const techDensity = technicalTerms.length / Math.max(words.length, 1);

  if (techDensity > 0.05) advancedScore += 2;
  else if (techDensity > 0.02) intermediateScore += 1;

  // Determine level
  if (advancedScore >= intermediateScore && advancedScore >= beginnerScore) {
    return 'advanced';
  }
  if (intermediateScore >= beginnerScore) {
    return 'intermediate';
  }
  return 'beginner';
}

// ============================================
// Internal Helpers
// ============================================

/**
 * Calculate percentage of comments containing questions
 * @param {string[]} texts
 * @returns {number} 0-100
 */
function calculateQuestionDensity(texts) {
  if (!texts.length) return 0;
  const questionCount = texts.filter(isQuestion).length;
  return Math.round((questionCount / texts.length) * 100);
}

/**
 * Check if a text contains a question
 * @param {string} text
 * @returns {boolean}
 */
function isQuestion(text) {
  if (!text) return false;
  const lower = text.toLowerCase();

  // Check for question mark
  if (lower.includes('?')) return true;

  // Check for question words at start or after punctuation
  const words = tokenize(lower);
  if (words.length === 0) return false;

  // First word is a question word
  if (QUESTION_WORDS.has(words[0])) return true;

  // Question word after common punctuation
  for (let i = 1; i < words.length; i++) {
    if (QUESTION_WORDS.has(words[i]) && [',', ';', ':', '-', '—'].some(p => lower.includes(p))) {
      return true;
    }
  }

  // Question patterns
  const questionPatterns = [
    /\b(how|what|why|when|where|who|which)\s+(do|does|did|can|could|should|would|will|is|are|was|were|has|have|had)\b/i,
    /\b(can|could|should|would|will|shall|may|might|must)\s+(you|we|i|they|it|this|that)\b/i,
    /\b(is|are|was|were|does|do|did|has|have|had)\s+(this|that|it|there|here|he|she|they)\b/i,
    /\banyone\s+(know|have|done|tried|used|recommend|suggest)\b/i,
    /\b(let me know|curious about|wondering if|trying to figure out)\b/i,
  ];

  return questionPatterns.some(p => p.test(lower));
}

/**
 * Calculate sentiment score from comment texts
 * @param {string[]} texts
 * @returns {number} 0-100
 */
function calculateSentimentScore(texts) {
  if (!texts.length) return 50;

  let totalScore = 0;
  let scoredComments = 0;

  for (const text of texts) {
    const words = tokenize(text.toLowerCase());
    let commentScore = 0;
    let sentimentWords = 0;

    for (const word of words) {
      if (POSITIVE_WORDS.has(word)) {
        commentScore += 1;
        sentimentWords++;
      } else if (NEGATIVE_WORDS.has(word)) {
        commentScore -= 1;
        sentimentWords++;
      }
    }

    // Normalize per comment
    if (sentimentWords > 0) {
      // Scale to roughly -5 to +5 range, then map to 0-100
      const normalized = Math.max(-5, Math.min(5, commentScore));
      totalScore += ((normalized + 5) / 10) * 100;
      scoredComments++;
    }
  }

  if (scoredComments === 0) {
    // No sentiment words found — neutral
    return 50;
  }

  return Math.round(totalScore / scoredComments);
}

/**
 * Assess overall engagement quality
 * @param {Array} comments
 * @param {number} sentimentScore
 * @param {number} questionDensity
 * @returns {string}
 */
function assessEngagementQuality(comments, sentimentScore, questionDensity) {
  const totalComments = comments.length;
  const avgLength = comments.reduce((sum, c) => {
    const text = typeof c === 'string' ? c : c.text || c.comment || '';
    return sum + text.length;
  }, 0) / Math.max(totalComments, 1);

  const totalLikes = comments.reduce((sum, c) => sum + (c.likeCount || 0), 0);
  const avgLikes = totalLikes / Math.max(totalComments, 1);

  let score = 0;

  // Volume
  if (totalComments >= 100) score += 3;
  else if (totalComments >= 50) score += 2;
  else if (totalComments >= 20) score += 1;

  // Comment length (thoughtfulness)
  if (avgLength >= 150) score += 3;
  else if (avgLength >= 80) score += 2;
  else if (avgLength >= 40) score += 1;

  // Sentiment
  if (sentimentScore >= 70) score += 2;
  else if (sentimentScore >= 50) score += 1;

  // Question engagement
  if (questionDensity >= 10 && questionDensity <= 30) score += 2;
  else if (questionDensity > 0) score += 1;

  // Likes on comments
  if (avgLikes >= 5) score += 2;
  else if (avgLikes >= 2) score += 1;

  if (score >= 9) return 'excellent';
  if (score >= 7) return 'high';
  if (score >= 5) return 'good';
  if (score >= 3) return 'moderate';
  return 'low';
}

/**
 * Simple tokenizer — splits on whitespace and strips punctuation
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

// ============================================
// Convenience Exports
// ============================================

/**
 * Quick sentiment analysis for a single comment
 * @param {string} text
 * @returns {{score: number, label: 'positive' | 'negative' | 'neutral'}}
 */
export function analyzeSentiment(text) {
  const words = tokenize(text);
  let score = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) score++;
    else if (NEGATIVE_WORDS.has(word)) score--;
  }

  if (score > 0) return { score, label: 'positive' };
  if (score < 0) return { score, label: 'negative' };
  return { score, label: 'neutral' };
}

/**
 * Get top recurring themes from comments
 * @param {string[]} commentTexts
 * @param {number} [topN=5]
 * @returns {Array<{theme: string, count: number}>}
 */
export function extractRecurringThemes(commentTexts, topN = 5) {
  if (!Array.isArray(commentTexts) || commentTexts.length === 0) return [];

  const wordCounts = new Map();

  for (const text of commentTexts) {
    const words = tokenize(text);
    for (const word of words) {
      if (NEUTRAL_WORDS.has(word) || word.length < 3) continue;
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  return [...wordCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([theme, count]) => ({ theme, count }));
}

/**
 * Batch analyze multiple videos' comments
 * @param {Array<{videoId: string, comments: Array}>} videoCommentBatches
 * @returns {Array<{videoId: string, intelligence: ReturnType<analyzeCommentIntelligence>}>}
 */
export function batchAnalyzeComments(videoCommentBatches) {
  return videoCommentBatches.map(({ videoId, comments }) => ({
    videoId,
    intelligence: analyzeCommentIntelligence(comments),
  }));
}
