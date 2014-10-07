var helloWorld = {
	'abap': 'WRITE \'Hello, World!\'.\n',
	'actionscript': 'package {\n\timport flash.display.Sprite;\n\timport flash.text.TextField;\n \n\tpublic class HelloWorld extends Sprite {\n\t\tpublic function HelloWorld():void  {\n\t\t\tvar message:TextField = new TextField;\n\t\t\tmessage.text = "Hello, World!";\n\t\t\tthis.addChild(message);\n\t\t}\n\t}\n}\n',
	'assembly_x86': '; hello_world.asm\n bits 16\n org 100h\n \n mov ah, 09\n mov dx, message\n int 21h\n \n mov ax, 4C00h\n int 21h\n \nmessage db \'Hello, World!$\'\n',
	'c': '#include <stdio.h>\n \nint main(void)\n{\n\tprintf("Hello, world!");\n\treturn 0;\n}\n',
	'cpp': '#include <iostream>\n \nint main()\n{\n\tstd::cout << "Hello, World!" << std::endl;\n}\n',
	'cobol': 'IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO-WORLD.\nPROCEDURE DIVISION.\nDISPLAY "Hello, World!".\nSTOP RUN.\n',
	'coffee': 'hello = ->\n\tconsole.log("Hello, World!")\n\nhello()\n',
	'csharp': 'class HelloWorldApp {\n\tpublic static void Main() {\n\t\tSystem.Windows.Forms.MessageBox.Show("Hello, World!");\n\t}\n}\n',
	'css': '#helloWorld {\n\tcolor: #0000FF;\n\tfont-weight: bold;\n}\n',
	'clojure': '(println "Hello, World!")\n',
	'd': 'private import std.stdio;\n \nvoid main()\n{\n\twriteln("Hello, World!");\n}\n',
	'dart': 'main() {\n \tprint(\'Hello, World!\');\n}\n',
	'erlang': '-module(hello).\n-export([hello_world/0]).\n \nhello_world() -> io:fwrite("Hello, World!\\n").\n',
	'forth': ': HELLO  ( -- )  CR ." Hello, World!" ; HELLO <cr>\nHELLO\n',
	'golang': 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Print("Hello, World!\\n")\n}\n',
	'groovy': 'print \'Hello, World!\'',
	'haml': '.content Hello, World!\n',
	'haskell': 'main = putStrLn "Hello, World!"\n',
	'haxe': 'class Test {\n\tstatic function main() {\n\t\ttrace("Hello, World!");\n\t}\n}\n',
	'html': '<p>Hello, World!</p>\n',
	'java': 'public class Hello\n{\n\tpublic static void main (String [] args)\n\t{\n\t\tSystem.out.println ("Hello, World!") ;\n\t}\n}\n',
	'javascript': 'console.log(\'Hello, World!\');\n',
	'jsx': 'class _Main\n{\n\tstatic function main (args : string []) : void\n\t{\n\t\tlog "Hello, World!" ;\n\t}\n}\n',
	'lisp': '(format t "Hello, World!\\n")\n',
	'lsl': 'default\n{\n\tstate_entry()\n\t{\n\t\tllSay(0, "Hello, World!");\n\t}\n}\n',
	'lua': '-- hello.lua\nprint("Hello, World!")\n',
	'matlab': 'printf (\'Hello, World!\\n\')',
	'mysql': 'SELECT "Hello, World!";\n',
	'objectivec': '#import <stdio.h>\nint main( int argc, const char *argv[] ) {\n\tprintf( "Hello, World!\\n" );\n\treturn 0;\n}\n',
	'ocaml': ' print_endline "Hello world!";;',
	'pascal': 'program Hello(output);\nbegin\n writeln(\'Hello, World!\')\nend.\n',
	'perl': 'print "Hello, World!\\n";\n',
	'php': '<?php\n\techo \'Hello, World!\';\n\texit;\n?>\n',
	'prolog': 'goal :-\n\twrite(\'Hello, World!\\n\').\n',
	'python': 'print "Hello, World!"\n',
	'r': 'print("Hello, World!")\n',
	'ruby': 'puts "Hello, World!"\n',
	'rust': 'fn main() {\n\tio::println("Hello, World!");\n}\n',
	'scala': 'object HelloWorld extends Application {\n \tprintln("Hello, World!")\n}\n',
	'scheme': '(display "Hello, World!")\n(newline)\n',
	'sh': '#!/bin/sh\necho Hello, World!\n',
	'tex': '\\documentclass{jarticle}\n\\begin{document}\nHello, world!\n\\end{document}\n',
	'typescript': 'module Greeting{\n\texport class Hello{\n\t\tconstructor(private text : string){\n\t\t}\n\t\tsay() : void{\n\t\t\tconsole.log(this.text);\n\t\t}\n\t}\n}\nvar hello : Greeting.Hello = new Greeting.Hello("Hello, World!");\nhello.say();\n',
	'vbscript': 'WScript.Echo "Hello, World!"\n',
	'verilog': 'module main();\n\tinitial begin\n\t\t#0 $display("Hello, World!");\n\t\t#1 $finish;\n\tend\nendmodule\n',
	'xml': '<message>Hello, World!</message>\n',
	'xquery': 'xquery version "1.0";\nlet $message := \'Hello, World!\'\nreturn\n<results>\n\t<message>{$message}</message>\n</results>\n'
};



// クラス類
var EditScreenController = function () {
	this.playing = false;
	this.tokenizing = false;
	this.finflg = true;
	this.$save = $('.code-check');

	this.saveStart = '>> 登録';
	this.saveWait = '更新中...';

	this.editTip = new PowerTipController($.powerTip, $('#editor .ace_cursor' ), {
		manual        : true,
		placement     : 's',
		smartPlacement: true
	});
}
EditScreenController.prototype = {
	checkStart: function () {
		this.finflg = false;
		this.$save.addClass('disabled');
		this.$save.text(this.saveWait);
	},

	checkFinish: function (finish) {
		if (finish) {
			this.$save.removeClass('disabled');
			this.$save.text(this.saveStart);

			this.finflg = this.playing = true;
			this.editTip.hide();
		}
		editor.setReadOnly(false);
	}
}