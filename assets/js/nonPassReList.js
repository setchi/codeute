var nonPassList = {
	'css': {
		next: /[a-zA-Z0-9_.#[]/,
		prev: /[a-zA-Z0-9_\]]/
	},

	'javascript': {
		next: /[a-zA-Z0-9_$]/,
		prev: /[a-zA-Z0-9_$]/
	},

	'powershell': {
		next: /[a-zA-Z0-9_-]/,
		prev: /[a-zA-Z0-9_]/
	},

	'lisp': {
		next: /[^ \n\t;]/,
		prev: /[^ \n\t]/
	},

	'scheme': {
		next: /[^ \n\t;]/,
		prev: /[^ \n\t]/
	},

	'clojure': {
		next: /[^ \n\t;]/,
		prev: /[^ \n\t]/
	}
}
