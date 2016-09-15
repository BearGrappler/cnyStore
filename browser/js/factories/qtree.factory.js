app.factory('QTreeFactory', function() {

	/**
     * Questionnaire Tree (also QTree or Node) Constructor
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

    /**
     * Adds a given question node to the base node (this)'s answer list.
     * @param {[Object]} node [QTree]
     * @returns {[Object]} [Returns original base node to facilitate chaining]
     */
    Questionnaire.prototype.addAnswer = function(node) {
        node.parent = this;
        this.answers.push(node);
        return this;

    }

    /**
     * Adds a given question node as an answer to ALL ANSWER NODES of the base node (this)'s answer list.
     * @param {[Object]} node [QTree]
     * @returns {[Object]} [Returns original base node to facilitate chaining]
     */
    Questionnaire.prototype.chainAnswer = function(node) {
        this.answers.forEach(answer => {
            answer.addAnswer(node)
        });
        return this;
    }

    /**
     * Toggles the node's selected property;
     * @return {[type]} [description]
     */
    Questionnaire.prototype.selectNode = function() {
        this.selected = !this.selected;
    }

    return Questionnaire;

});
