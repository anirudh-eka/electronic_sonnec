desc "Deploy _site/ to gh-pages branch"
task :deploy do
  puts "\n## Deleting gh-pages branch"
  status = system("git branch -D gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Creating new gh-pages branch and switching to it"
  status = system("git checkout -b gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Forcing the _site subdirectory to be project root"
  status = system("git filter-branch --subdirectory-filter _site/ -f")
  puts status ? "Success" : "Failed"
  puts "\n## Switching back to source branch"
  status = system("git checkout source")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing all branches to origin"
  status = system("git push --all origin")
  puts status ? "Success" : "Failed"
end

# to commit in zsh you must escape the '[]', eg:
# rake commit\[''\]

desc "Commit _site/"
task :commit, [:message] do |t, args|
  puts "\n## Staging modified files"
  status = system("git add -A")
  puts status ? "Success" : "Failed"
  puts "\n## Committing a site build at #{Time.now.utc} with message #{args[:message]}"
  message_with_time = "#{args[:message]}\n Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message_with_time}\"")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing commits to remote"
  status = system("git push origin gh-pages-source")
  puts status ? "Success" : "Failed"
end
