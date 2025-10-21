# Replace paths if your project lives elsewhere
DEST="/Users/evgeny/Projects/recipe-website/ui/public/pictures"
SRC="/Users/evgeny/Projects/recipe-crawler/src/image-alter/image-out/simplerecipes"


# create the symlink
ln -s "$SRC" "$DEST"

# verify
ls -la "$DEST"
