import * as fsPromises from 'fs/promises';
import * as path from 'path';

(async () => {
	const release_dir = './gh_release/';
	const release_files = [
		['./src/elhelper.ts', path.join(release_dir, 'elhelper.ts')],
		['./dist/types/elhelper.d.ts', path.join(release_dir, 'elhelper.d.ts')],
		['./dist/cjs/elhelper.js', path.join(release_dir, 'elhelper.cjs.js')],
		['./dist/esm/elhelper.js', path.join(release_dir, 'elhelper.esm.js')],
		['./dist/umd/elhelper.js', path.join(release_dir, 'elhelper.umd.js')],
	];
	// clear out any left-over release dir
	await fsPromises.rm(release_dir, {recursive:true, force:true}).then(`rm ${release_dir}`);//.catch(()=>{});
	// make sure release dir exists
	await fsPromises.mkdir(release_dir, {recursive:true});
	// copy files over
	await Promise.all(
		release_files
			.map(([srcfile, dstfile])=>fsPromises.copyFile(srcfile, dstfile).then(()=>console.log(`${srcfile} -> ${dstfile}`)))
	);
})();

function foo(...args) { return args; }

// (async () => {
// 	for(const dir of await fsPromises.readdir('./dist/', {withFileTypes:true})) {
// 		console.log(`  - ${dir.name}`);
// 		for(const file of await fsPromises.readdir(`./dist/${dir.name}`)) {
// 			console.log(`    - ${file}`);
// 		}
// 	}
// })()



