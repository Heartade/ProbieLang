# An esoteric but not-so-hard programming language: PROBIE, definition ver 0.3.

# 1. Overview
- PROBIE LANGUAGE is a language which is characteristically run by a `Probe` which constantly moves on a code written on two-dimensional `field`. In PROBIE, the code space and memory space are not separated, all values are stored as characters, and the code itself may change during runtime.

# 2 Definition of field
- The field refers to the code itself, which consists of lines of text with constant width. Each character on the field is called `cell`. The interpreter determines the width of the field based on the width of the first line. After that, the interpreter throws an exception when the probe or cursor tries to read or write a value, where there is none. (Note that simply placing the probe or cursor outside the field would not cause an exception; only trying to 'access' a nonexistent cell would cause the interpreter to fail.)
- During the operation, the cells in the field are modified by the probes in real time in order to perform data storage and operations. The position of a cell is expressed as `[Y, X]`, meaning `X`th column of `Y`th row when viewed as a two-dimensional array. The location of the first character of the code is `[0, 0]`.

# 3. Definition of Cursor and Probe
- The `MEM cursor` and `probe` are always present on the field, and the probe is composed of `READ Pointer` and `WRITE Pointer`.
## 3.1. `MEM` cursor
- The `MEM` cursor moves only when the probe orders it to, and it can save or load values on the field. The `MEM` cursor is located at the position `[0, 0]` at the start of a program.
## 3.2. Probe
- The probe is always moving; each time moving to a nearby cell and performing an action. When the probe's moving interval becomes zero, the interpreter accepts it as a halt sign. The probe consists of a `READ` pointer which reads commands and a `WRITE` pointer which performs those read by `READ`, and is able to store a value. (Refer to 4. Character and Value for how the values are stored.)
### 3.2.1. `READ` pointer
- The `READ` pointer reads a command from its position on the field every time it moves to a new position. Position of the probe is defined as position of the `READ` pointer. The `READ` pointer is located on `[0, 0]` at the beginning of the program and starts to move one cell at a time to the right.
### 3.2.2. `WRITE` pointer
- The `WRITE` pointer performs commands read by the `READ` pointer, and the position of the `WRITE` pointer is defined relatively to the `READ` pointer. The position of the `WRITE` pointer is `[0, 0]` from the `READ` pointer at the beginning of the program.

# 4. Character and Value
- All values stored in the probe and the cell are stored as characters. For example, if you perform an addition of `0` and `2`, it would become `b` because PROBIE counts this as addition of `48` and `50` in ASCII values.
## 4.1. Value of the characters 
- The characters present in the ASCII code table have the same value as the corresponding code.
- Any unicode character that does not exist in ASCII code table (except the ones listed below) has a value of 0.
- In the ASCII code table, numbers from 0 to 31 and 127 are not printable, so the following characters have their values instead :
- `○` : 0 (this character is a default when the interpreter has to handle the value 0.)
- `① - ⑮` : 1-15
- `◎` : 16
- `ⓐ - ⓞ` : 17 - 31
- `●` : 127
## 4.2. Special characters
- Some characters take up two cells. During the reading activity, when the probe encounters a `\`, it will try to read and save the next character as well. They are used to process tasks such as `P` or `I`. If these characters are given as user input to a probe of `I` state, they would be stored as two seperate characters in the input buffer.
Note that these characters have a value of zero in and can be read differently depending on the direction of the probe movement.
- `\0` : indicates the end of the string.
- `\n` : indicates a line break.
- `\t` : indicates a tab.
- `\\` : stands for `\`.
- If any other character other than listed above is read after the `\`, the probe will overwrite the `\` character.
# 5. Command
- The following commands are valid immediately after being read by the `READ` pointer : Therefore, it is advised to place the `READ` and `WRITE` pointers in different positions. (That is because if these two pointers are always located in the same cell, for example the `P` command would always print itself and the `I` command would always overwrite itself.) 
- Commands are divided into volatile commands which tell the probe to perform a specific motion once, movement commands which move the probe and cursor, and the nonvolatile commands which tell the probe to constantly perform an action after each move.
- The `READ` pointer ignores non-command characters. You are free to write whatever you want on the course of the `READ` pointer!
## 5.1. Volatile commands
### 5.1.1. Conditional Operators
- Conditional Operators all move the probe by 1 cell. The direction of the movement depends on outcome of the comparison, and does not impact consistent jump interval and direction of the probe itself.
- `{` : Compare the values 1 cell above and below the current position. Move the probe to the left if the above value is greater; else move it to the right.
- `}` : Compare the values 1 cell above and below the current position. Move the probe to the right if the above value is greater; else move it to the left.
- `∧` : Compare the values 1 cell left and right to the current position. Move the probe upwards if the left value is greater; else move it downwards.
- `∨` : Compare the values 1 cell left and right to the current position. Move the probe downwards if the left value is greater; else move it upwards.
- `↔` : Compare the value stored on the probe and the value of the `WRITE` pointer position. Move the probe to the left if the value stored on the probe is greater; else move it to the right.
- `↕` : Compare the value stored on the probe and the value of the `WRITE` pointer position. Move the probe upwards if the value stored on the probe is greater; else move it downwards.
```
TRANSLATION OF THIS DOCUMENT BELOW THIS LINE IS NOT FINISHED YET.
```
### 5.1.2. Operator
Please note that when you perform a calculation, the size of the values that can be stored on each cell and the probe are from 0 to 127, and the values of the values above are stored only with 128.
#### 5.1.2.1. Change the value of the " WRITE " pointer
- " + " : The cells in the " WRITE " position add the stored value to the probe in the probe position.
- " - " : " From the WRITE " point of the " WRITE " point, deduct the value stored on the probe.
- " x " : The cells in the " WRITE " point position multiplied by the values stored on the probe.
- " ÷ " : In the " WRITE " position, divide the values stored in the probe in the probe position.
- " % " : " The cells in the WRITE " position are obtained by dividing the cells into the values stored on the probe.
### # 5.1.2.2 Change the value stored on the probe
- " A " : Add the value of the " WRITE " pointer to the value stored on the probe.
- " D " : Subtract the value of the " WRITE " pointer from the values stored on the probe.
- " M " : The values stored on the probe are multiplied by the value of the " WRITE " pointer.
- " d " : From the values stored on the probe, divide the value of the " WRITE " pointer.
- " m " : The values stored on the probe are saved by dividing the value of the probe into the value of the " WRITE " pointer.
## # 5.1.3 5.1.3 INTERIOR INTERACTIONS INTERACTION
- The following operations are used to store and recall values in the " MEM " cursor position :
- " [" ["]] Writes the value stored on the probe to the value of the " MEM " cursor position.
- " Under " : " The value of the MEM " cursor is changed to the value stored on the probe.
- Replace the " _ " : " MEM " of the " MEM " cursor to the value stored on the probe.
- " | " : Move the Y position of the " MEM " cursor to the value stored on the probe.
## 5.2. Movement
## # 5.2.1. " READ " POINT TRAINING
- Movement of the " READ " pointer is defined in the movement interval and direction, which is equivalent to the movement of the probe itself.
- The " > " : " READ " pointer increases 1 inch of travel interval.
- The " < " : " READ " pointer reduces the movement of the moving distance. When the move interval reaches zero, the program stops.
- Turn the " R " : " READ " pointer clockwise to rotate the direction of rotation 90 degrees clockwise.
- Turn the " L " : " READ " pointer towards 90 degrees counter clockwise.
## # 5.2.2 . ` WR IT ` idong pointeo E # 
- " → ", " ← ", " ↑ ", " ↓ ", and " WR IT " locate the relative position of the " READ " Pointer.
## # 5.2.3. Move the " MEM " cursor
Move the cursor, " ▽ ", " ◁ ", " ▷ " and " MEM " to move the cursor.
" ▲ ", " ▼ ", " ◀ ", " ▶ ", and " MEM " shall move the probe to the moving distance of the probe.
## 5.3. non-volatile command
The following commands continue to be followed until the other non-volatile command is read by the " READ " pointer.
- " S " : Replace the value stored on the probe with the value of the " WRITE " pointer.
- " s " : " WRITE " The value of the " WRITE " is changed to the value stored on the probe.
- " P " : print the value of the " WRITE " pointer in the console.
- " I " : " The WRITE " point in the " WRITE " position brings a single letter in the user's input buffer at a time.
" X " : " S ", " S ", " P ", " I " and " I ".
## 5.4. explanatory notes
- " READ! " When the " READ " pointer reads this command, the " READ " pointer ignores all commands until the reading is read again.

# 6. Example codes
Many of these are not tested yet, so caution is required.
## 6.1. Hello world!
```
↓P...........<
.HELLO WORLD!.
```
## 6.2. Repeatedly adding 1 until 9
```
①.>R..<.[..↓..+....↑←←R
...↓......n\..0L]XS←←▷R
...↓.......9..>↔L→→→→◁R
...R↓Xs↑.X.PXSP.....↑↑R
..............L.<→→→→↓R
........<X..........P.R
..........n\!dehsiniF..
```
## 6.3. 01 to 99
```
R......................................................................
/ ! MEMORY SPACE FOR FIRST DIGIT   ! ..................................
0 ! MEMORY SPACE FOR SECOND DIGIT  ! ..................................
① ! MEMORY SPACE FOR INTEGER CONST ! ..................................
......................................................! END ! <........
............<.................................................<........
L▽→[........↕9.................................................9.......
....R─────▽→←△─────────────────────────────────────────R.R↑──>L↔<─R....
....│.......................! CALCULATION SPACE !.0....│.│........↓....
....│...! LOADING VARIABLE       !..L────────────Xs[▽↑─R.│........▽....
....│...! ADDING OPERATION       !..L↑▽▽[─────────+───△R.│........▽....
....│...! SAVING VARIABLE TO MEM !..L△──────────]XS──↑△R.│........[....
....│...! RETURNING WRITE POS    !..L──────────────↓↓↓───L........△....
....│.............................................................△....
....│...../.! RESERVED SPACE !....................................│....
....R↓↓─────△△─────────────────L.! RETURNING MEM POS !............│....
....R↑↑───SX▽▽]────────────────L.! RESETTING DIGIT   !............│....
....│.............................................................│....
....←.R←────────────────────────────────────────────────────────R │....
....├↔8...........................! CALCULATION SPACE !.n\0.....│ │....
....→→..! LOADING VARIABLE       !..L────────────────────Xs[▽▽↑─R │....
....││..! ADDING OPERATION       !..L↑▽[──────────────────+─────R │....
....││..! SAVING VARIABLE TO MEM !..L───────────────────]XS───↑△R │....
....││..! LOADING VARIABLE       !..L↑△[──────────────────sX────R │....
....││..! PRINTING VARIABLE      !..L────────────────────XP───↑─R │....
....││..! LOADING VARIABLE       !..L↑▽[──────────────────sX────R │....
....││..! PRINTING VARIABLE      !..L──────────────────X──P───↑─R │....
....││..! RETURNING WRITE POS    !..L↓△△──────────────────↓↓↓↓↓↓R │....
....││..........................................................│.│....
....│R──────────────────────────────────────────────────←─┬──→──R │....
....│....................................................1∧0─→────R....
....R───────────────────────────────────────────────────←─┘............
.......................................................................
```
