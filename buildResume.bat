pdflatex resume.tex -output-directory=./temp -jobname=Resume_Latex
cd temp
move ./Resume_Latex.pdf ..
cd ..
del /q temp
rmdir temp 