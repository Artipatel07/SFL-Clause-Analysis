/**
 *Contains code given to me by Supervisor Dr.John G. Keating-
 *Changed code to suit my needs
 *Contains two drawing functions, one for drawing generic tree, one for drawing graded tree
 *Two refresh methods, one for removing generic tree, one for removing graded tree
 *D3 causes issues with removing elements - which is why two different methods for each were needed
 *Calls get functions to retrieve - links, nodes and triangle positions
 */
var mostLeftPoint = 720;
var mostRightPoint = 0;
var svgWidth = widthDigit//(document.getElementById('TreeArea').offsetWidth), // * .985, widthDigit in initialise file
svgHeight = svgWidth / 2, center = 0;
devide = 1.4;
var initialiseAgain = false;
var fontsize = (svgWidth / 120) / devide,
  linkSpace = (fontsize) / (devide),
  trainglepadding = (fontsize) / (devide),
  stroke_width = (fontsize / 15) / (devide);

var maxLength = 10;
var separation = 12;
var doneBefore = 8;
var minimumWidthDigit = $('#panel2').width() / 2 //to ensure the middle isn't too left of the panel

/*wordwrap2 = function(str, width, brk, cut) {
  brk = brk || '\n';
  width = width || 40;
  cut = cut || false;
  if (!str) {
    return str;
  }
  var regex = '.{0,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
  return str.match(RegExp(regex, 'g')).join(brk);
};*/

refresh = function () {
  d3.select('#nodes').selectAll('text').data(tree.getNodes()).exit().remove();
  d3.select('#links').selectAll('line').data(tree.getLinks()).exit().remove();
  d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).exit().remove();
  d3.select('#indexOfClauseTree').remove();
  d3.select('#captionTranslation').remove();
}
refresh_grade = function () {
  d3.select('#nodes_2').selectAll('text').data(tree.getincorrectNodes()).exit().remove();
  d3.select('#links_2').selectAll('line').data(tree.getincorrectLinks()).exit().remove();
  d3.select('#triangles_2').selectAll('polygon').data(tree.getincorrectTriangles()).exit().remove();

  d3.select('#nodes_3').selectAll('text').data(tree.getcorrectNodes()).exit().remove();
  d3.select('#links_3').selectAll('line').data(tree.getcorrectLinks()).exit().remove();
  d3.select('#triangles_3').selectAll('polygon').data(tree.getcorrectTriangles()).exit().remove();
}


//Redraw normal tree - no grading
redraw = function () {

  //console.log(devide);
  refresh();
  refresh_grade();

  var nodes = d3.select('#nodes').selectAll('text').data(tree.getNodes());
  var tempLowestPoint = 0, tempLeft = 720, tempRight = 0;
  // get extreme points in tree
  //root node
  nodes.text(function (node) {
    /*var regex = '.{0,' + 1 + '}(\\s|$)' + (false ? '|.{' + 1 + '}|.+$' : '|\\S+?(\\s|$)');
    var lines = (node.text).match(RegExp(regex, 'g')).join('\n');
    //var lines = wordwrap2(this.name, 2).split('\n');
    for (var i = 0; i < lines.length; i++) {
      d3.select(this)
        .append("tspan")
        .attr("dy", 5)
        .attr("x", 100)
        .text(lines[i]);
    }*/

    //return node.text
  }) /*.transition().duration(500)*/
    .attr('x', function (node) {
      return node.x - center;
    }).attr('y', function (node) {
      return node.y;
    }) //5
    .attr('fill', function (node) {
      if (node.isLeaf) {
        return 'black';
      } else {
        return 'black';
      }
    })//Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px',
      'font-family': 'Times New Roman'
    }); //red|blue

  nodes.enter().append('text').attr('id', function (node) { /*/ /////console.log.log('id = ' + node.id);*/
    return node.id;
  })
    /*.attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }).text*/
    .each(function (node) {
      if (tempLeft > node.x) { mostLeftPoint = node.x - 40; tempLeft = node.x - 40; widthDigit = mostRightPoint - mostLeftPoint + 60; }
      if (tempRight < node.x) { mostRightPoint = node.x + 40; tempRight = node.x + 40; widthDigit = mostRightPoint - mostLeftPoint + 60; }
      if (tempLowestPoint < node.y) { lowestPoint = node.y; tempLowestPoint = node.y; };
      center = 720 - widthDigit / 2
      //console.log('Width of tree: ' + widthDigit)
      //console.log("Center: " + center)
      //var regex = '.{0,' + 1 + '}(\\s|$)' + (false ? '|.{' + 1 + '}|.+$' : '|\\S+?(\\s|$)');
      //var lines = (node.text).match(RegExp(regex, 'g')).join('\n');

    })
    .attr('tWidth', function (node) {
      var n = tree.getNode(node);
      n.tWidth = this.getBBox().width;
      return this.getBBox().width;
    })
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px',
      'font-family': 'Times New Roman'
    });

  if (widthDigit < minimumWidthDigit) {
    center = 720 - minimumWidthDigit
    widthDigit = minimumWidthDigit * 2
  }
  // if (adjust) {
  //   center = 0;
  //   widthDigit = 1440
  // }
  nodes.each(function (node) {
    var lines = [node.text];
    if (node.text != null && (node.text).includes("|")) {
      lines = (node.text).split("|");
      let lengthOfLines = lines.length;
      for (let line = 0; line < lengthOfLines; line += 2) {
        lines.splice(line + 1, 0, "_____");
      }
    }

    if (node.text != null && (node.text).includes("~")) {
      for (let ind = 0; ind < lines.length; ind++) {
        if (lines[ind].includes("~")) {
          let translation = lines[ind].substring(lines[ind].indexOf('~') + 1, lines[ind].length);
          lines[ind] = lines[ind].replace('~' + translation, '');
          lines.splice(ind + 1, 0, "     ");
          lines.splice(ind + 2, 0, translation);

        }
      }
    }

    let specialChar = '$'
    if (node.text != null && (node.text).includes(specialChar)) {
      for (let ind = 0; ind < lines.length; ind++) {
        if (lines[ind].includes(specialChar)) {
          let translation = lines[ind].substring(lines[ind].indexOf(specialChar) + 1, lines[ind].length);
          lines[ind] = lines[ind].replace(specialChar + translation, '');
          lines.splice(ind + 1, 0, "   $  ");
          lines.splice(ind + 2, 0, translation);
          ind += 1;
        }
      }
    }

    let underlineChar = '£'
    if (node.text != null && (node.text).includes(underlineChar)) {
      for (let ind = 0; ind < lines.length; ind++) {
        if (lines[ind].includes(underlineChar)) {
          let splitCharArray = lines[ind].split(underlineChar)
          lines[ind] = ''
          for (let index = 0; index < splitCharArray.length; index++) {
            if (index % 2 != 0)
              lines[ind] += '<tspan style="text-decoration:underline">' + splitCharArray[index] + '</tspan>'
            else
              lines[ind] += splitCharArray[index];
          }
        }
      }
    }

    a = ''

    for (var i = 0; i < lines.length; i++) {
      let plus = 0;
      if (i != 0) {
        if (lines[i - 1] != "   $  ") {
          if (lines[i] == "_____") {
            plus = 6;
          }
          if (lines[i] == "     ") {
            plus = 6;
          }
          if (lines[i] == "   $  ") {
            plus = 6;
          }
          d3.select(this)
            .append("tspan")
            .attr("y", node.y)
            .attr("x", node.x - center)
            .html(lines[i].replace('$', '').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'"));
          node.y += (3 + plus);
        }
        else {
          d3.select(this)
            .append("tspan")
            .attr("y", node.y)
            .attr("x", node.x - center)
            .html(lines[i].replace('$', '').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&apos;/g, "'"))
            .style({ 'font-style': 'italic', 'font-family': 'Times New Roman' })
          node.y += (3 + plus);
        }

      }
      else {
        d3.select(this)
          .append("tspan")
          .attr("y", node.y)
          .attr("x", node.x - center)
          .text(lines[i])
          .style({ 'font-family': 'Times New Roman' })
        node.y += (3 + plus);
      }



    }
    return ((node.text).replace("\\", ""));
  })
    .attr('x', function (node) {
      return node.x - center;
    }).attr('y', function (node) {
      return node.y;
    }) //5
    .attr('fill', function (node) {
      if (node.isLeaf) {
        return 'black';
      } else {
        return 'black';
      }
    }) //red|blue
  //$('#svgTree-0').css({'width':widthDigit + 'px', "height": lowestPoint+'px'})
  // d3.select("#svgTree-" + num).style().attr('width', widthDigit).attr('height', lowestPoint + 120)
  //   //ADDING IN CLAUSE NUMBER
  //   .append('g').attr('id', 'indexOfClauseTree').append("text").attr("x", 20).attr("y", lowestPoint).append("tspan").text(indexOfTheCurrentClause).style({
  //     'text-anchor': 'middle',
  //     'cursor': 'pointer',
  //     'font-size': fontsize + 'px',
  //     'font-family': "Times New Roman"
  //   });
  var caption = $('#newCaptionValue').val();
  //ADDING THE CAPTION IF EXISTS
  d3.select("#svgTree-" + num).append('g').attr('id', 'captionTranslation').append("text").attr("y", lowestPoint + 80).attr("x", widthDigit / 2).append("tspan").text(caption).style({
    'text-anchor': 'middle',
    'text-align': 'center',
    'cursor': 'pointer',
    'font-size': fontsize + 'px',
    'font-family': "Times New Roman"
  });

  var links = d3.select('#links').selectAll('line').data(tree.getLinks());

  links /*.transition().duration(500)*/
    .attr('x1', function (link) {
      return link.fromX - center;
    }).attr('y1', function (link) {
      return link.fromY + linkSpace;
    }) //10
    .attr('x2', function (link) {
      return link.toX - center;
    }).attr('y2', function (link) {
      return link.toY - linkSpace;
    });

  links.enter().append('line')
    .attr('x1', function (link) {
      return link.fromX - center;
    }).attr('y1', function (link) {
      return link.fromY + linkSpace;
    })
    .attr('x2', function (link) {
      return link.toX - center;
    }).attr('y2', function (link) {
      return link.toY - linkSpace;
    })

    .style({
      'stroke': 'black',
      'stroke-width': stroke_width + 'px'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison



  var triangles = d3.select('#triangles').selectAll('polygon').data(tree.getTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + ((triangle.leftX - center) - trainglepadding) + ',' + triangle.leftY + ' ' + ((triangle.rightX - center) + trainglepadding) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon')
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + ((triangle.leftX - center) - trainglepadding) + ',' + triangle.leftY + ' ' + ((triangle.rightX - center) + trainglepadding) + ',' + triangle.rightY)
    })
    .style({
      'stroke': 'black',
      'stroke-dasharray': 0,
      'stroke-width': stroke_width + 'px',
      'fill': 'white'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + ((triangle.leftX - center) - trainglepadding) + ',' + triangle.leftY + ' ' + ((triangle.rightX - center) + trainglepadding) + ',' + triangle.rightY)

    }); /*
    if(initialiseAgain == true){
  initialiseAgain = false;

  setTimeout(function() {
    if(doneBefore == 0){
      doneBefore = 4;
    }
    if(doneBefore  > 0){
    initialise();
    doneBefore--;
  }
},405);
}*/}


//Redraw tree showing grade differences
redraw_grade = function () {
  refresh();
  refresh_grade();

  ////console.log("-- 1");

  var nodes = d3.select('#nodes_3').selectAll('text').data(tree.getcorrectNodes());

  nodes.text(function (node) {
    return node.text
  }) /*.transition().duration(500)*/
    .attr('x', function (node) {
      return node.x - center;
    }).attr('y', function (node) {
      return node.y + 5;
    }). //5
    attr('fill', function (node) {
      if (node.isLeaf) {
        return 'black';
      } else {
        return 'black';
      }
    }); //red/blue

  nodes.enter().append('text').attr('id', function (node) { /*//console.log('id = ' + node.id);*/
    return node.id;
  })/*.attr('x', function(node) {
      return node.x - center;
    }).attr('y', function(node) {
      return node.y + 5;
    }).text*/
    .each(function (node) {
      //var regex = '.{0,' + 1 + '}(\\s|$)' + (false ? '|.{' + 1 + '}|.+$' : '|\\S+?(\\s|$)');
      //var lines = (node.text).match(RegExp(regex, 'g')).join('\n');
      var lines = [node.text];
      if ((node.text).includes("|")) {
        lines = (node.text).split("|");
        let lengthOfLines = lines.length;
        for (let line = 0; line < lengthOfLines; line += 2) {
          lines.splice(line + 1, 0, "_____");
        }
      }

      if (node.text != null && (node.text).includes("~")) {
        for (let ind = 0; ind < lines.length; ind++) {
          if (lines[ind].includes("~")) {
            let translation = lines[ind].substring(lines[ind].indexOf('~') + 1, lines[ind].length);
            lines[ind] = lines[ind].replace('~' + translation, '');
            lines.splice(ind + 1, 0, "     ");
            lines.splice(ind + 2, 0, translation);

          }
        }
      }
      //var lines = wordwrap2(this.name, 2).split('\n');
      let plus = 0;
      for (var i = 0; i < lines.length; i++) {

        if (i != 0) {
          if (lines[i] == "_____") {
            plus = 10;
          }
          if (lines[i] == "     ") {
            plus = 10;
          }
        }
        d3.select(this)
          .append("tspan")
          .attr("y", node.y)
          .attr("x", node.x - center)
          .text(lines[i]);
        node.y += (3 + plus);
      }
      return ((node.text).replace("\\", ""));
    })
    .attr('tWidth', function (node) {
      var n = tree.getNode(node);
      n.tWidth = this.getBBox().width;
      return this.getBBox().width;
    })
    //Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px'
    });

  var nodes = d3.select('#nodes_2').selectAll('text').data(tree.getincorrectNodes());

  nodes.text(function (node) {
    return node.text
  }) /*.transition().duration(500)*/
    .attr('x', function (node) {
      return node.x - center;
    }).attr('y', function (node) {
      return node.y + 5;
    }). //5
    attr('fill', function (node) {
      if (node.isLeaf) {
        return 'black';
      } else {
        return 'black';
      }
    }); //red/blue

  nodes.enter().append('text').attr('id', function (node) { /*//console.log('id = ' + node.id);*/
    return node.id;
  })/*.attr('x', function(node) {
      return node.x - center;
    }).attr('y', function(node) {
      return node.y + 5;
    }).text*/
    .each(function (node) {
      //var regex = '.{0,' + 1 + '}(\\s|$)' + (false ? '|.{' + 1 + '}|.+$' : '|\\S+?(\\s|$)');
      //var lines = (node.text).match(RegExp(regex, 'g')).join('\n');
      var lines = [node.text];

      if ((node.text).includes("|")) {
        lines = (node.text).split("|");
        let lengthOfLines = lines.length;
        for (let line = 0; line < lengthOfLines; line += 2) {
          lines.splice(line + 1, 0, "_____");
        }
      }

      if (node.text != null && (node.text).includes("~")) {
        for (let ind = 0; ind < lines.length; ind++) {
          if (lines[ind].includes("~")) {
            let translation = lines[ind].substring(lines[ind].indexOf('~') + 1, lines[ind].length);
            lines[ind] = lines[ind].replace('~' + translation, '');
            lines.splice(ind + 1, 0, "     ");
            lines.splice(ind + 2, 0, translation);

          }
        }
      }
      //var lines = wordwrap2(this.name, 2).split('\n');
      let plus = 0;
      for (var i = 0; i < lines.length; i++) {
        if (i != 0) {
          if (lines[i] == "_____") {
            plus = 10;
          }
          if (lines[i] == "     ") {
            plus = 10;
          }
        }
        d3.select(this)
          .append("tspan")
          .attr("y", node.y)
          .attr("x", node.x - center)
          .text(lines[i]);
        node.y += (3 + plus);
      }
      return ((node.text).replace("\\", ""));
    })
    .attr('tWidth', function (node) {
      var n = tree.getNode(node);
      n.tWidth = this.getBBox().width;
      ////console.log(n.tWidth);
      return this.getBBox().width;
    })
    //Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px',
      'font-weight': 'bold',
      'font-style': 'italic'
    });
  //var links = [];
  var links_3 = d3.select('#links_3').selectAll('line').data(tree.getcorrectLinks());
  ////console.log("links>>", links);
  links_3.attr('x1', function (link) {
    return link.fromX - center;
  }).attr('y1', function (link) {
    return link.fromY + linkSpace;
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  });

  links_3.enter().append('line').attr('x1', function (link) {
    return link.fromX - center;
  }).attr('y1', function (link) {
    return link.fromY + linkSpace;
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 'dash',
    'stroke-width': stroke_width + 'px'
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  });
  //var links_2 = [];
  var links_2 = d3.select('#links_2').selectAll('line').data(tree.getincorrectLinks());
  ////console.log("links_incorrect>>", links_2);

  links_2.attr('x1', function (link) {
    return link.fromX - center;
  }).attr('y1', function (link) {
    return link.fromY + linkSpace;
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  });

  links_2.enter().append('line').attr('x1', function (link) {
    return link.fromX - center;
  }).attr('y1', function (link) {
    return link.fromY + linkSpace;
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 5,
    'stroke-width': stroke_width + 'px'
  }).attr('x2', function (link) {
    return link.toX - center;
  }).attr('y2', function (link) {
    return link.toY - linkSpace;
  });

  ////console.log("diff >> ", diff_array);
  var triangles = d3.select('#triangles_3').selectAll('polygon').data(tree.getcorrectTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
        (triangle.leftX - center) - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
          (triangle.rightX - center) + trainglepadding
        ) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon').attr('points', function (triangle) {
    return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
      (triangle.leftX - center) - trainglepadding
    ) + ',' + triangle.leftY + ' ' + (
        (triangle.rightX - center) + trainglepadding
      ) + ',' + triangle.rightY)
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 'dash',
    'stroke-width': stroke_width + 'px',
    'fill': 'white'
  }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
        (triangle.leftX - center) - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
          (triangle.rightX - center) + trainglepadding
        ) + ',' + triangle.rightY)
    });

  var triangles = d3.select('#triangles_2').selectAll('polygon').data(tree.getincorrectTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
        (triangle.leftX - center) - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
          (triangle.rightX - center) + trainglepadding
        ) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon').attr('points', function (triangle) {
    return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
      (triangle.leftX - center) - trainglepadding
    ) + ',' + triangle.leftY + ' ' + (
        (triangle.rightX - center) + trainglepadding
      ) + ',' + triangle.rightY)
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 5,
    'stroke-width': stroke_width + 'px',
    'fill': 'white'
  }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function (triangle) {
      return ((triangle.topX - center) + ',' + triangle.topY + ' ' + (
        (triangle.leftX - center) - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
          (triangle.rightX - center) + trainglepadding
        ) + ',' + triangle.rightY)
    });
}