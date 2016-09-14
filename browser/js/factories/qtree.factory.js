app.factory('QTreeFactory', function() {

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

    return Questionnaire;

});
