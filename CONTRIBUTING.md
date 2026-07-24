# Contributing

#comment-contribuer

## How to contribute

Contributions may be proposed by creating a pull request.

In general, a change request for maintenance, a new feature, or both should be initiated in one of the following ways:

- Internally by Principal Publisher at any time;
- By the vendor **after** notifying Principal Publisher, verbally or in writing, that a change is required;
- By the vendor **after** being explicitly requested by Principal Publisher to contribute to a specific change request; or
- Through another method considered appropriate by Principal Publisher.

Principal Publisher reserves the right to accept or decline any proposed change.

Before beginning a significant change, contributors should review the existing issues and pull requests and discuss the proposed approach with the project contacts.

## Creating a pull request

If you have write access:

1. Create a branch from the default branch.
2. Make the required changes.
3. Test the changes locally.
4. Commit the changes using a clear commit message.
5. Push the branch to the repository.
6. Create a pull request.

If you do not have write access, editing a file through GitHub will create a fork of this project where you can save your proposed changes. The change will be saved to a new branch in your fork, allowing you to submit a pull request to this repository.

A pull request should include:

- A clear description of the change;
- The reason for the change;
- A reference to the related issue or change request, when applicable;
- Instructions for testing the change;
- Screenshots for visible interface changes;
- Any effect on English and French content;
- Any accessibility considerations; and
- Any effect on the statistical methodology or interpretation.

Avoid including unrelated changes in the same pull request.

## Testing changes

Before submitting a pull request, test the calculator locally by opening `index.html` in a supported browser.

At minimum, confirm that:

- Version A and Version B inputs accept valid whole numbers;
- Conversions cannot exceed visitors;
- Invalid values do not produce valid-looking results;
- Conversion rates and statistical results update correctly;
- The interface works in English and French;
- The interface can be operated using a keyboard;
- The layout remains usable at different screen sizes and zoom levels; and
- The documented reference example produces approximately:
  - Version A conversion rate: `5.00%`
  - Version B conversion rate: `6.00%`
  - Relative improvement: `+20.00%`
  - Absolute difference: `+1.00 percentage point`
  - Z-score: `2.19`
  - Two-sided p-value: `0.0283`

The reference example should meet the 80%, 90%, and 95% statistical-significance thresholds, but not the 99% threshold.

Changes to the statistical calculations, test direction, confidence thresholds, or interpretation of results require appropriate technical and subject-matter review.

See `README.md` for additional information about the statistical methodology, assumptions, architecture, and known limitations.

## Bilingual content

User-facing content must be updated in both English and French.

When changing interface text:

1. Update the English content.
2. Update the corresponding French content.
3. Confirm that both versions communicate an equivalent meaning.
4. Test the interface in both languages.
5. Follow the approved translation or linguistic-review process.

Dynamic interface strings are stored in the `STRINGS` object in `js/script.js`. Static bilingual content is stored in `index.html`.

## Security

**Do not post security issues in the public repository.**

See `SECURITY.md` for instructions on reporting a suspected vulnerability.

## Questions

If this is your first time contributing through GitHub, contact the project team using an approved contact method listed on Principal Publisher's GCpedia page.

---

# Comment contribuer

#how-to-contribute

## Comment contribuer

Les contributions peuvent être proposées en créant une demande de tirage (*pull request*).

En général, une demande de changement liée à la maintenance, à l'ajout d'une nouvelle fonctionnalité, ou aux deux, devrait être initiée de l'une des façons suivantes :

- À tout moment, à l'interne, par l'Éditeur principal;
- Par le fournisseur, **après** avoir avisé l'Éditeur principal, verbalement ou par écrit, qu'un changement est nécessaire;
- Par le fournisseur, **après** que l'Éditeur principal lui a explicitement demandé de contribuer à une demande de changement précise; ou
- Selon une autre méthode jugée appropriée par l'Éditeur principal.

L'Éditeur principal se réserve le droit d'accepter ou de refuser toute modification proposée.

Avant d'entreprendre une modification importante, les personnes qui souhaitent contribuer devraient consulter les problèmes et les demandes de tirage existants et discuter de l'approche proposée avec les personnes-ressources du projet.

## Création d'une demande de tirage

Si vous disposez d'un accès en écriture :

1. Créez une branche à partir de la branche par défaut.
2. Apportez les modifications nécessaires.
3. Testez les modifications localement.
4. Validez les modifications à l'aide d'un message clair.
5. Publiez la branche dans le dépôt.
6. Créez une demande de tirage.

Si vous ne disposez pas d'un accès en écriture, la modification d'un fichier dans GitHub créera une copie (*fork*) de ce projet dans laquelle vous pourrez enregistrer les modifications proposées. La modification sera enregistrée dans une nouvelle branche de votre copie, ce qui vous permettra de soumettre une demande de tirage à ce dépôt.

Une demande de tirage devrait comprendre :

- Une description claire de la modification;
- La raison de la modification;
- Une référence au problème ou à la demande de changement connexe, le cas échéant;
- Les instructions permettant de tester la modification;
- Des captures d'écran pour les changements visibles dans l'interface;
- Toute incidence sur le contenu anglais et français;
- Toute considération relative à l'accessibilité;
- Toute incidence sur la méthodologie statistique ou l'interprétation des résultats.

Évitez d'inclure des modifications sans lien entre elles dans une même demande de tirage.

## Mise à l'essai des modifications

Avant de soumettre une demande de tirage, testez la calculatrice localement en ouvrant `index.html` dans un navigateur pris en charge.

Au minimum, confirmez que :

- Les champs des versions A et B acceptent des nombres entiers valides;
- Le nombre de conversions ne peut pas dépasser le nombre de visiteurs;
- Les valeurs non valides ne produisent pas de résultats qui semblent valides;
- Les taux de conversion et les résultats statistiques sont correctement mis à jour;
- L'interface fonctionne en anglais et en français;
- L'interface peut être utilisée à l'aide d'un clavier;
- La mise en page demeure utilisable sur différentes tailles d'écran et à différents niveaux de zoom;
- L'exemple de référence documenté produit approximativement les résultats suivants :
  - Taux de conversion de la version A : `5,00 %`
  - Taux de conversion de la version B : `6,00 %`
  - Amélioration relative : `+20,00 %`
  - Différence absolue : `+1,00 point de pourcentage`
  - Cote Z : `2,19`
  - Valeur p bilatérale : `0,0283`

L'exemple de référence devrait atteindre les seuils de signification statistique de 80 %, 90 % et 95 %, mais pas celui de 99 %.

Les modifications apportées aux calculs statistiques, au sens du test, aux seuils de confiance ou à l'interprétation des résultats nécessitent un examen technique et spécialisé approprié.

Consultez le fichier `README.md` pour obtenir de plus amples renseignements sur la méthodologie statistique, les hypothèses, l'architecture et les limites connues.

## Contenu bilingue

Le contenu destiné aux utilisateurs doit être mis à jour en anglais et en français.

Lorsque vous modifiez le contenu de l'interface :

1. Mettez à jour le contenu anglais.
2. Mettez à jour le contenu français correspondant.
3. Confirmez que les deux versions communiquent un sens équivalent.
4. Testez l'interface dans les deux langues.
5. Suivez le processus approuvé de traduction ou de révision linguistique.

Les chaînes dynamiques de l'interface sont stockées dans l'objet `STRINGS` du fichier `js/script.js`. Le contenu bilingue statique est stocké dans `index.html`.

## Sécurité

**Ne publiez aucun problème de sécurité dans le dépôt public.**

Consultez le fichier `SECURITY.md` pour savoir comment signaler une vulnérabilité présumée.

## Questions

S'il s'agit de votre première contribution dans GitHub, communiquez avec l'équipe du projet en utilisant une méthode de communication approuvée indiquée sur la page GCpédia de l'Éditeur principal.
