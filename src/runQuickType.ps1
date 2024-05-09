param (
    [string]$input
)
node -e "require('./index.ts').run('$input')"