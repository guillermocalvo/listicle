
function emojiProcess (s, myDirectory) {
	if (myDirectory === undefined) { //1/11/17 by DW
		myDirectory = "code/emojify/images/emoji";
		}
	else {
		if (endsWith (myDirectory, "/")) { //1/11/17 by DW
			myDirectory = stringDelete (myDirectory, myDirectory.length, 1);
			}
		}
	emojify.setConfig ({
		img_dir: myDirectory 
		});
	s = emojify.replace (s, function (emoji, name) {
		return "<img title='" + name + "' alt='" + name + "' class='emoji' src='" + myDirectory + '/' + name + ".png' align='absmiddle' />";
		});
	return (s);
	}
