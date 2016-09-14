app.factory('QuestionFactory', function($http) {

    let questions = {
        home: new Questionnaire(0, 'Home', 'Which type of computer are you looking for?', {}),
        desktop: new Questionnaire(1, 'Desktop', 'Which type of user are you?', { computer: 'desktop' }),
        laptop: new Questionnaire(2, 'Laptop', 'Which type of user are you?', { computer: 'laptop' }),
        gamer: new Questionnaire(3, 'Gamer', 'Select your favorite genres', { type: 'gamer' }),
        artist: new Questionnaire(4, 'Artist', 'Do you work with audio? Video? More creative media?', { type: 'artist' }),
        student: new Questionnaire(5, 'Student', 'What are you studying?', { type: 'student' }),
        casual: new Questionnaire(6, 'Casual', "What's important to you?", { type: 'casual' }),

        gamerGenreRTS: new Questionnaire(7, 'Strategy', "What's important to you?", { cpu: '4', ram: '4', gpu: '2' }),
        gamerGenreRPG: new Questionnaire(8, 'Role Playing Games', "What's important to you?", { cpu: '4', ram: '3', gpu: '4' }),
        gamerGenreFPS: new Questionnaire(9, 'FPS/Action', "What's important to you?", { cpu: '4', ram: '3', gpu: '4' }),
        gamerGenreINDIE: new Questionnaire(10, 'Indie', "What's important to you?", { cpu: '2', ram: '2', gpu: '2' }),

        artistGenreAudio: new Questionnaire(11, 'Audio', "What's important to you?", { cpu: '4', ram: '3', gpu: '0' }),
        artistGenreVideo: new Questionnaire(12, 'Video', "What's important to you?", { cpu: '4', ram: '3', gpu: '1' }),
        artistGenrePhoto: new Questionnaire(13, 'Photo', "What's important to you?", { cpu: '3', ram: '2', gpu: '0' }),

        studentMajorSTEM: new Questionnaire(14, 'Science/Technology/Math', "What's important to you?", { cpu: '3', ram: '2', gpu: '1' }),
        studentMajorTrade: new Questionnaire(15, 'Trade School', "What's important to you?", { cpu: '1', ram: '1', gpu: '0' }),
        studentMajorLibArts: new Questionnaire(16, 'Liberal Arts', "What's important to you?", { cpu: '2', ram: '2', gpu: '0' }),
        studentMajorSports: new Questionnaire(17, 'Sports', "What's important to you?", { cpu: '1', ram: '2', gpu: '0' }),

        price: new Questionnaire(18, 'Price', '', { price: '1' }),
        speed: new Questionnaire(19, 'Speed', '', { cpu: '3', ram: '2', gpu: '0', hdd: '4', price: '5' }),
        graphics: new Questionnaire(20, 'Graphics', '', { gpu: '5', price: '4' }),
        space: new Questionnaire(21, 'Space', '', { hdd: '5', price: '3' }),
        rounded: new Questionnaire(22, 'Well-Rounded', '', { cpu: '2', ram: '2', gpu: '2', hdd: '2', price: '2' }),
    };

    let defaultFilters = {
        computer: [],
        type: [],
        price: [],
        priority: [],
        processor: [],
        ram: [],
        hdd: [],
        cpu: [],
        gpu: []
    };

    /**
     * Questionnaire Tree Constructor
     * @param {[Number]} id         [Integer key for the node (enables lookup)]
     * @param {[String]} label      [Descriptor to display on selector element]
     * @param {[String]} question   [Question to display to user (answer selectors are in this.answers)]
     * @param {[Object]} filtersObj [Filters to apply based on answer choice]
     */
    function Questionnaire(id, label, question, filtersObj) {
        this.id = id;
        this.question = question;
        this.label = label;
        this.filters = filtersObj
        this.answers = [];
        this.parent = null;
        this.selected = false;
    }

    Questionnaire.prototype.addAnswer = function(node) {
        node.parent = this;
        this.answers.push(node);
        return this;

    }

    Questionnaire.prototype.chainAnswer = function(node) {
        this.answers.forEach(answer => {
            answer.addAnswer(node)
        });
        return this;
    }

    Questionnaire.prototype.selectNode = function() {
        this.selected = !this.selected;
        console.log(this.label, this.selected ? 'on' : 'off');
    }

    /**
     * QuestionStack Stack Constructor
     * @param {[Questionnaire]} rootNode [The root node of the question tree (should be 'home' node - ID: 1)]
     * @param {[Object]}        filters  [Filters to load - can retrieve filters from Cart entry in DB]
     */
    function QuestionStack(rootNode, filters) {
        this.stack = [];
        this.displayed = [];
        this.selected = [];
        this.currentFilters = Object.assign({}, defaultFilters, filters);
        this.rootNode = rootNode;
    }

    QuestionStack.prototype.add = function(nodes) {
        if (Array.isArray(nodes)) {
            nodes.forEach(node => this.stack.push(node));
        } else { this.stack.push(nodes); }
    }

    QuestionStack.prototype.assign = function(obj) {
        let keys = Object.keys(obj);
        keys.forEach(key => {
            if (this.currentFilters.hasOwnProperty(key)) {
                this.currentFilters[key].push(obj[key]);
            }
        })
    }

    QuestionStack.prototype.advance = function() {
        this.selected = this.displayed.filter(node => node.selected);
        this.selected.forEach(node => {
            node.selected = false;
            if (node.answers.length) this.add(node);
            this.assign(node.filters);
        })
        let nextNode = this.stack.length > 0 ? this.stack.pop() : null;
        this.displayed = nextNode ? nextNode.answers : [];
        this.selected = [];
        return nextNode;
    }

    QuestionStack.prototype.setStack = function(obj, filters = {}) {
        if (Array.isArray(obj)) this.stack = obj;
        else this.stack = [obj];
        this.displayed = obj.answers;
        this.assign(filters);
    }

    QuestionStack.prototype.findNodeById = function(node, id) {
        if (!node) node = this.rootNode;
        if (node.id === id) this.setStack(node);
        else node.answers.forEach(answer => Questionnaire.findNodeById(answer, id));
    }

    /**
     * Initializes tree structure/associations for questionnaire.
     * @return {[undefined]} [Nothing returned]
     */
    QuestionStack.prototype.initialize = function() {
        questions.home.addAnswer(questions.desktop);
        questions.home.addAnswer(questions.laptop);

        questions.desktop
            .addAnswer(questions.gamer)
            .addAnswer(questions.artist)
            .addAnswer(questions.student)
            .addAnswer(questions.casual);

        questions.laptop
            .addAnswer(questions.gamer)
            .addAnswer(questions.artist)
            .addAnswer(questions.student)
            .addAnswer(questions.casual);

        questions.gamer
            .addAnswer(questions.gamerGenreRTS)
            .addAnswer(questions.gamerGenreINDIE)
            .addAnswer(questions.gamerGenreFPS)
            .addAnswer(questions.gamerGenreRPG);

        questions.gamer
            .chainAnswer(questions.price)
            .chainAnswer(questions.speed)
            .chainAnswer(questions.graphics)
            .chainAnswer(questions.space)
            .chainAnswer(questions.rounded);

        questions.artist
            .addAnswer(questions.artistGenrePhoto)
            .addAnswer(questions.artistGenreAudio)
            .addAnswer(questions.artistGenreVideo);

        questions.artist
            .chainAnswer(questions.price)
            .chainAnswer(questions.speed)
            .chainAnswer(questions.graphics)
            .chainAnswer(questions.space)
            .chainAnswer(questions.rounded);

        questions.student
            .addAnswer(questions.studentMajorSTEM)
            .addAnswer(questions.studentMajorTrade)
            .addAnswer(questions.studentMajorSports)
            .addAnswer(questions.studentMajorLibArts);
        questions.student
            .chainAnswer(questions.price)
            .chainAnswer(questions.speed)
            .chainAnswer(questions.graphics)
            .chainAnswer(questions.space)
            .chainAnswer(questions.rounded);

        questions.casual
            .addAnswer(questions.price)
            .addAnswer(questions.speed)
            .addAnswer(questions.graphics)
            .addAnswer(questions.space)
            .addAnswer(questions.rounded);


        this.setStack(this.rootNode);

        return this;
    }

    return new QuestionStack(questions.home);

});
