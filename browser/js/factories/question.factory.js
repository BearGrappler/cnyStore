app.factory('QuestionFactory', function($http) {

    let questions = {
        home: new Questionnaire(0, 'Home', 'Which type of computer are you looking for?', {}),
        desktop: new Questionnaire(1, 'Desktop', 'Which type of user are you?', { computer: 'desktop' }),
        laptop: new Questionnaire(2, 'Laptop', 'Which type of user are you?', { computer: 'laptop' }),
        gamer: new Questionnaire(3, 'Gamer', 'Select your favorite genres', { type: 'gamer' }),
        artist: new Questionnaire(4, 'Artist', 'Do you work with audio? Video? More creative media?', { type: 'artist' }),
        student: new Questionnaire(5, 'Student', 'What are you studying?', { type: 'student' }),
        casual: new Questionnaire(6, 'Casual', "What's important to you?", { type: 'casual' }),
    };

    let defaultFilters = {
        computer: null,
        type: null,
        price: null,
        priority: null,
        processor: null,
        ram: null,
        hdd: null
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
        this.selected = false;
    }

    Questionnaire.prototype.addAnswer = function(node) {
        return this.answers.push(node);
    }

    Questionnaire.prototype.selectNode = function() {
        this.selected = true;
    }

    Questionnaire.prototype.deselectNode = function() {
        this.selected = false;
    }

    /**
     * QuestionStack Stack Constructor
     * @param {[Questionnaire]} rootNode [The root node of the question tree (should be 'home' node - ID: 1)]
     * @param {[Object]}        filters  [Filters to load - can retrieve filters from Cart entry in DB]
     */
    function QuestionStack(rootNode, filters) {
        this.stack = [];
        this.displayed = [];
        this.currentFilters = Object.assign({}, defaultFilters, filters || {});
        this.rootNode = rootNode;
    }

    QuestionStack.prototype.add = function(nodeArr) {
        nodeArr.forEach(node => this.stack.push(node));
    }

    QuestionStack.prototype.advance = function() {
        let selected = this.displayed.filter(node => node.selected);
        this.add(selected);
        Object.assign(this.currentFilters, selected.map(node => node.filters));
        let nextNode = this.stack.length > 0 ? this.stack.pop() : null;
        if (nextNode) this.displayed = nextNode.answers;
        return nextNode;
    }

    QuestionStack.prototype.setStack = function(obj) {
        if (Array.isArray(obj)) this.stack = obj;
        else this.stack = [obj];
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
        questions.home.addAnswer(questions.desktop);

        questions.desktop.addAnswer(questions.gamer);
        questions.desktop.addAnswer(questions.artist);
        questions.desktop.addAnswer(questions.student);
        questions.desktop.addAnswer(questions.casual);

        questions.laptop.addAnswer(questions.gamer);
        questions.laptop.addAnswer(questions.artist);
        questions.laptop.addAnswer(questions.student);
        questions.laptop.addAnswer(questions.casual);

        this.setStack(this.rootNode);
    }

    return new QuestionStack(questions.home);

});
