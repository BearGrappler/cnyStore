app.factory('QStackFactory', function($http, QTreeFactory) {

    let defaultFilters = {
        type: [],
        computer: [],
        cpu: 0,
        gpu: 0,
        ram: 0,
        hdd: 0,
        size: 0
    };

    let QTree = QTreeFactory.bind(QTreeFactory);

    // Probably should move to a database at some point in the future timeline which will totally happen...
    let questions = {
        home: new QTree(0, 'Form Factor', 'Which type of computer are you looking for?', {}),
        desktop: new QTree(1, 'Desktop', 'Which type of user are you?', { computer: 'desktop' }),
        laptop: new QTree(2, 'Laptop', 'Which type of user are you?', { computer: 'laptop' }),
        gamer: new QTree(3, 'Gamer', 'Select your favorite genres', { type: 'gamer' }),
        artist: new QTree(4, 'Artist', 'Do you work with audio? Video? Photo?', { type: 'artist' }),
        student: new QTree(5, 'Student', 'What are you studying?', { type: 'student' }),
        casual: new QTree(6, 'Specs', "What's important to you?", { type: 'casual' }),

        gamerGenreRTS: new QTree(7, 'Strategy', "What's important to you?", { cpu: 4, ram: 4, gpu: 2 }),
        gamerGenreRPG: new QTree(8, 'RPGs', "What's important to you?", { cpu: 4, ram: 3, gpu: 4 }),
        gamerGenreFPS: new QTree(9, 'Action', "What's important to you?", { cpu: 4, ram: 3, gpu: 4 }),
        gamerGenreINDIE: new QTree(10, 'Indie', "What's important to you?", { cpu: 2, ram: 2, gpu: 2 }),

        artistGenreAudio: new QTree(11, 'Audio', "What's important to you?", { cpu: 4, ram: 3, gpu: '0', size: 2 }),
        artistGenreVideo: new QTree(12, 'Video', "What's important to you?", { cpu: '4', ram: '3', gpu: '1', size: 2, hdd: 3 }),
        artistGenrePhoto: new QTree(13, 'Photo', "What's important to you?", { cpu: '3', ram: '2', gpu: '0', size: 2 }),

        studentMajorSTEM: new QTree(14, 'STEM', "What's important to you?", { cpu: '3', ram: '2', gpu: '1', size: 1 }),
        studentMajorTrade: new QTree(15, 'Vocations', "What's important to you?", { cpu: '1', ram: '1', gpu: '0', size: 1 }),
        studentMajorLibArts: new QTree(16, 'Liberal Arts', "What's important to you?", { cpu: '2', ram: '2', gpu: '0', size: 1 }),
        studentMajorSports: new QTree(17, 'Sports', "What's important to you?", { cpu: '1', ram: '2', gpu: '0', size: 3 }),

        price: new QTree(18, 'Price', '', {}),
        speed: new QTree(19, 'Speed', '', { cpu: '3', ram: '2', gpu: '0', hdd: '4' }),
        graphics: new QTree(20, 'Graphics', '', { gpu: '5' }),
        size: new QTree(21, 'Size', '', { hdd: '3', size: '5' })
    };

    /**
     * QuestionStack Stack Constructor
     * @param {[QTree]} rootNode [The root node of the question tree (should be 'home' node - ID: 1)]
     * @param {[Object]}        filters  [Filters to load - can retrieve filters from Cart entry in DB]
     */
    function QuestionStack(rootNode, filters = {}) {
        this.filters = filters;
        this.rootNode = rootNode;
        this.pristine = true;
    }

    QuestionStack.prototype.add = function(nodes) {
        if (Array.isArray(nodes)) {
            nodes.forEach(node => this.stack.push(node));
        } else { this.stack.push(nodes); }
    }

    /**
     * Puts filter parameters from an object into the 'this.currentFilter' property
     * @param  {[object]} obj [filter parameter(s) taken from QTree node]
     * @return {[undefined]}     [side effect only]
     */
    QuestionStack.prototype.assign = function(obj) {
        let keys = Object.keys(obj);
        let filters = this.currentFilters;
        keys.forEach(key => {
            switch (key) {
                case 'computer':
                    filters.computer.push(obj[key])
                    break;
                case 'type':
                    filters.type.push(obj[key])
                    break;
                default:
                    {
                        if (filters.hasOwnProperty(key)) filters[key] = +filters[key] + +obj[key];
                    }
                    break;
            }
        })
    }

    /**
     * This method handles moving down a node in the question tree by wiring QTree/QStack moving parts
     * @return {[QTree]} [The next QTree node to display to the user]
     */
    QuestionStack.prototype.advance = function() {
        this.pristine = false;
        let selected = this.displayed.filter(node => node.selected);
        selected.forEach(node => {
            node.selected = false;
            if (node.answers.length) this.add(node);
            this.assign(node.filters);
        })
        let nextNode = this.stack.length > 0 ? this.stack.pop() : null;
        this.displayed = nextNode ? nextNode.answers : [];
        return nextNode;
    }

    /**
     * Sets the QStack 'stack' property (all the "queued-up" questions)
     * @param {[Object || Array]} obj     [Either a QTree or array of QTrees]
     * @param {Object} filters [A set of filters to apply to the Qstack 'currentFilter' property]
     */
    QuestionStack.prototype.setStack = function(obj, filters = {}) {
        if (Array.isArray(obj)) {
            this.stack = obj;
            this.displayed = obj[obj.length - 1].answers;
        } else {
            this.stack = [obj];
            this.displayed = obj.answers;
        }
        this.assign(filters);
    }

    /**
     * Finds a node in the tree by id and sets it as the current node.
     * @param  {[Object]} node [QTree node to start the search]
     * @param  {[Number]} id   [Integer id number corresponding to QTree node]
     * @return {[undefined]}      [just used for side effects]
     */
    // QuestionStack.prototype.findNodeById = function(node, id) {
    //     if (!node) node = this.rootNode;
    //     if (node.id === id) return this.setStack(node);
    //     else node.answers.forEach(answer => QTree.findNodeById(answer, id));
    // }

    /**
     * Initializes tree structure/associations for QTree.
     * @return {[undefined]} [Nothing returned]
     */
    QuestionStack.prototype.initialize = function() {

        questions.home.addAnswer(questions.desktop);
        questions.home.addAnswer(questions.laptop);

        questions.desktop
            .addAnswer(questions.gamer)
            .addAnswer(questions.artist)
            .addAnswer(questions.student);

        questions.laptop
            .addAnswer(questions.gamer)
            .addAnswer(questions.artist)
            .addAnswer(questions.student);

        questions.gamer
            .addAnswer(questions.gamerGenreRTS)
            .addAnswer(questions.gamerGenreINDIE)
            .addAnswer(questions.gamerGenreFPS)
            .addAnswer(questions.gamerGenreRPG);

        questions.artist
            .addAnswer(questions.artistGenrePhoto)
            .addAnswer(questions.artistGenreAudio)
            .addAnswer(questions.artistGenreVideo);

        questions.student
            .addAnswer(questions.studentMajorSTEM)
            .addAnswer(questions.studentMajorTrade)
            .addAnswer(questions.studentMajorSports)
            .addAnswer(questions.studentMajorLibArts);

        questions.casual
            .addAnswer(questions.price)
            .addAnswer(questions.speed)
            .addAnswer(questions.graphics)
            .addAnswer(questions.size)


        this.setStack([questions.casual, this.rootNode]);

        return this;
    }

    /**
     * Starts a new Question Tree process by assigning a new stack, clearing any displaying nodes, etc.
     * @return {[Object]} [Returns a QuestionStack object to facilitate chaining]
     */
    QuestionStack.prototype.start = function() {
        this.pristine = true;
        this.displayed.forEach(node => {
            node.selected = false
        })
        this.stack = [];
        this.displayed = [];
        this.currentFilters = Object.assign({}, JSON.parse(JSON.stringify(defaultFilters)), this.filters);
        this.setStack([questions.casual, this.rootNode]);
        return this;
    }

    return new QuestionStack(questions.home).initialize().start();

});
