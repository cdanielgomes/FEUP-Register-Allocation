# Register-Allocation
Extra project to Compiladores subject 

### GROUP:

up201502858 - Beatriz de Henriques Martins

up201603404 - Carlos Daniel Coelho Ferreira Gomes

up201605017 - Joana Sofia Mendes Ramos

### SUMMARY:

Register allocation is an important stage of compilers. It is responsible to allocate internal microprocessor registers for scalar variables in a software program. As the number of registers may not be enough to store, e.g., all the scalar variables in a function, some of those variables may have to be stored in memory (something that a compiler wants to avoid because of the overhead imposed by the memory access latencies). Register allocation considers that multiple variables might be allocated to the same register, the removal of move instructions, and cost models in order to select the variables to be stored in memory if needed.

This program implements part of a graph coloring based algorithm to do register allocation. The program was developed for teaching purposes in the context of a Compilers course and intends to show how a very important and widely used register allocation approach works. The implementation considers as input the interference graph as a DOT file (that can be output by liveness analysis) and the number of registers (or the set of registers) available. For coalescing, the program allows users to select between two different heuristics: Briggs or George. For spilling, the program used the degree of the nodes or a manual selection of the nodes to spill.

### Task assignment :

_**Beatriz**_ 
* Mockups
* Main page's interface
* Graph coloring [greedy algorithm](https://www.geeksforgeeks.org/graph-coloring-set-2-greedy-algorithm/)

_**Daniel**_ 
* Dot files
* Pre-colored

_**Joana**_ 
* Requirements specification
* Graph coloring algorithm (slides)
* Coalescing, spilling and freeze
* About page

