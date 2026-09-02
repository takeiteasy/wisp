(ns wisp.string
  (:require [wisp.runtime :refer [fn? str subs re-matches nil? string? re-pattern? dec max]]
            [wisp.sequence :refer [seq lazy-seq vec conj cons first second rest take count empty?]]))

(defvar re-find-all
  "Returns all matches of pattern occurring in string (as is)"
  (if (fn? (.-match-all ""))               ; Chrome 73+, Firefox 67+, Node 12+
    (lambda re-find-all (re s)
      (seq (.match-all s (RegExp re \g))))
    (lambda re-find-all (re s)
      ((lambda rec (suffix prefix)             ; simulating match-all behaviour
         (let ((x (.match suffix re)))
           (if x
             (let ((pos (+ (.-index x) (max 1 (count (first x))))))
               (Object.assign x {:input s :index (+ prefix (.-index x))})
               (if (empty? suffix)
                 (lazy-seq [x])
                 (lazy-seq (cons x (rec (subs suffix pos) (+ prefix pos)))))))))
       s #_"removing prefix to prevent repeat matches"
       0 #_"keeping track of removed prefix length"))))

(defun- clojure-split (string pattern limit)
  (loop ((matches (take (dec limit) (re-find-all pattern string))) (res []) (index 0))
    (if (empty? matches)
      (conj res (subs string index))
      (let ((x (first matches)))
        (recur (rest matches)
               (conj res (subs string index (.-index x)))
               (+ (.-index x) (count (first x))))))))

(defun split (string pattern limit)
  "Splits string on a regular expression.  Optional argument limit is
  the maximum number of splits. Not lazy. Returns vector of the splits."
  (if (not limit)
    (.split string pattern)
    (clojure-split string pattern (if (> limit 0) limit Infinity))))

(defun split-lines (s)
  "Splits s on \n or \r\n."
  (split s #"\n|\r\n"))

(defun join (&rest args)
  "Returns a string of all elements in coll, as returned by (seq coll),
   separated by an optional separator."
  (if (identical? (count args) 1)
    (apply str (vec (first args)))
    (.join (vec (second args)) (first args))))

(defun upper-case (string)
  "Converts string to all upper-case."
  (.toUpperCase string))

(defun lower-case (string)
  "Converts string to all lower-case."
  (.toLowerCase string))

(defun capitalize (s)
  "Converts first character of the string to upper-case, all other
  characters to lower-case."
  (if (< (count s) 2)
      (upper-case s)
      (str (upper-case (subs s 0 1))
           (lower-case (subs s 1)))))

(defvar- ESCAPE_PATTERN
  (RegExp. "([-()\\[\\]{}+?*.$\\^|,:#<!\\\\])" "g"))

(defun pattern-escape (source)
  (.replace (.replace source ESCAPE_PATTERN "\\$1")
            (RegExp. "\\x08" "g") "\\x08"))

(defun replace-first (string match replacement)
  "Replaces the first instance of match with replacement in s.
  match/replacement can be:

  string / string
  pattern / (string or function of match)."
  (.replace string match replacement))

(defun replace (string match replacement)
  "Replaces all instance of match with replacement in s.

   match/replacement can be:

   string / string
   char / char
   pattern / (string or function of match).

   See also replace-first."
  (cond ((string? match)
         (.replace string (RegExp. (pattern-escape match) "g") replacement))

        ((re-pattern? match)
         (.replace string (RegExp. (.-source match) "g") replacement))

        (else
         (throw (str "Invalid match arg: " match)))))


;(defvar **WHITESPACE** (str "[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000"
;                             "\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008"
;                             "\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]"))
;(defvar **LEFT-SPACES** (re-pattern (str "^" **WHITESPACE** **WHITESPACE** "*")))
;(defvar **RIGHT-SPACES** (re-pattern (str **WHITESPACE** **WHITESPACE** "*$")))
;(defvar **SPACES** (re-pattern (str "^" **WHITESPACE** "*$")))


(defvar **LEFT-SPACES** #"^\s\s*")
(defvar **RIGHT-SPACES** #"\s\s*$")
(defvar **SPACES** #"^\s\s*$")


(defvar triml
  "Removes whitespace from the left side of string."
  (if (nil? (.-trimLeft ""))
    (lambda (string) (.replace string **LEFT-SPACES** ""))
    (lambda (string) (.trimLeft string))))

(defvar trimr
  "Removes whitespace from the right side of string."
  (if (nil? (.-trimRight ""))
    (lambda (string) (.replace string **RIGHT-SPACES** ""))
    (lambda (string) (.trimRight string))))

(defvar trim
  "Removes whitespace from both ends of string."
  (if (nil? (.-trim ""))
    (lambda (string) (.replace (.replace string **LEFT-SPACES**) **RIGHT-SPACES**))
    (lambda (string) (.trim string))))

(defun blank? (string)
  "True if s is nil, empty, or contains only whitespace."
  (or (nil? string)
      (empty? string)
      (re-matches **SPACES** string)))

(defun reverse (string)
  "Returns s with its characters reversed."
  (join "" (.reverse (.split string #""))))
