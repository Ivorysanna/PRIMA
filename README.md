# PRIMA

#### Violetta Pyralov

Winter 2022/2023

MIB 6

PRIMA

Dozent: Prof. Jirka Dell´Oro-Friedl


## Executable
https://ivorysanna.github.io/PRIMA/FloppyBird/index.html

## Source Code
https://github.com/Ivorysanna/PRIMA/tree/master/FloppyBird

## Design Dokument
https://github.com/Ivorysanna/PRIMA/blob/master/FloppyBird/Design%20Dokument.pdf

## Steuerung
#### Floppybird:

Leertaste drücken wenn man Floppy Bird springen lassen will (einmal drücken).

#### Tubes schneller bewegen:

In der VUI mit der Maus den Regler bewegen.


## Kriterien
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU


| Nr | Criterion       | Explanation                                                                                                              |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions | Floppy Bird ist eine Unit hoch und breit. Tubes sind eine Unit Breit und mehrere Units hoch. Floppy Bird befindet sich im Ursprung (0,0,0). |
|  2 | Hierarchy         | Es gibt eine "World"-Node an der alle anderen Nodes hängen (Tubes, Floppy Bird, Background). In der Tube Node werden Tube-Paare durch Code erstellt und angehangen. Durch diese Hierarchie kann jedes Objekt einfach angesprochen werden. Tubes können durch die TubeContainer Node verschoben werden.|
|  3 | Editor            | FloppyBird und die Kamera wurden im Editor platziert. Die Kamera bewegt sich nur in die positive x-Richtung. Floppy Bird bewegt sich nur in die Y-Richtung. |
|  4 | Scriptcomponents  | ScriptComponents wurden für die Tubes benutzt, um diese zu bewegen und zu löschen. Für Floppy Bird sind Scriptcomponents für die Steuerung und Collision verantwortlich. |
|  5 | Extend            | Tube.ts extended f.Node, um die Tubes aus dem Code in die Szene zu laden. |
|  6 | Sound             | Sound wurde in PlaySoundManager.ts für 3 verschiedene Sounds verwendet. Wing Sound für das hochspringen des Floppy Birds. Beim Passieren von einem Tube-Paar hört man einen Point Sound und sobald man gegen eine Tube fliegt und auf den Boden fällt hört man einen Collision Sound. |
|  7 | VUI               | Im VUI sieht man die bereits überwundenen Tube-Paare (Score). Man kann auch die Geschwindigkeit der Tubes, mit einem Regler, anpassen. |
|  8 | Event-System      | Event-System wurde verwendet, um auf Collisions zu reagieren (Tubes und Punkt-Collidern).|
|  9 | External Data     | Eine JSON-Datei wird als Quelle von externen Daten verwendet. So können einige Parameter im Spiel verändert werden. |
|  A | Light             | Es wurde ein Ambient Light verwendet, um alle Objekte gleich zu beleuchten. |
|  B | Physics           | Es wurden Collisions und Force verwendet. Collision mit Floppy Bird und den Tubes und Floppy Bird und den Punkte-Collidern (liegen zwischen den Tube-Paaren) Force wurde verwendet um Floppy Bird in die positive y-Richtung zu "schubsen". Zusätzlich wirkt die Gravitation auf Floppy Bird.|
|  E | Animations        | Für jedes zweite Tube-Paar wurde eine Animation erstellt. Diese bewegen sich leicht in der y-Achse um ein etwas schwereres Hindernis zu bieten. |

