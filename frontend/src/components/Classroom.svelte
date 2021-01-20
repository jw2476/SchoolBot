<h1 class="title has-text-centered">{classroom.code}</h1>
<div class="columns">
    <div class="column is-one-third">
        <div class="box content">
            <h1 class="title has-text-centered">Students</h1>
            <br>
            <ul>
                {#each students as student}
                    <li>{student}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<script>
    import {onMount} from "svelte";
    import axios from "axios";

    export let classroom;

    let error
    let students = []

    onMount(async () => {
        const studentsDB = classroom.students

        for (const studentDB of studentsDB) {
            students = [...students, await axios.get(`http://localhost:8000/api/students/${studentDB.id}/name`).then(res => res.data)] // Svelte only updates on reassignment
        }

        console.log(students)
    })
</script>