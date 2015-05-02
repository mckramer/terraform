var marked = require("marked").setOptions({ langPrefix: 'language-', headerPrefix: '' })
var TerraformError = require("../../error").TerraformError
var frontmatter = require('html-frontmatter')
var marked = require("marked")
var renderer = new marked.Renderer()

// This overrides Marked’s default headings with IDs,
// since this changed after v0.2.9
// https://github.com/sintaxi/harp/issues/328
renderer.heading = function(text, level){
  return '<h' + level + '>' +  text + '</h' + level + '>'
}

module.exports = function(fileContents, options){

  return {
    compile: function(){
      return function (locals){

        var contents = fileContents.toString()
        var fm = frontmatter(contents);

        // inject frontmatter into locals
        for(var key in fm){
          locals[key] = fm[key]
          contents += fm[key]
        }

        return marked(contents.replace(/^\uFEFF/, ''), {
          renderer: renderer
        })
      }
    },

    parseError: function(error){
      error.stack = fileContents.toString()
      return new TerraformError(error)
    }
  }

}
