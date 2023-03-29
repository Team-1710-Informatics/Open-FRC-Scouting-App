<script lang="ts">
    import Form from '$lib/components/Form.svelte';

    const title = "Sign Up";

    export let data:any;
    export let form:any;
</script>
<svelte:head>
    <title>{title}</title>
</svelte:head>

<middle>
    <Form {title} {data} {form} action="signup" inputs={[
        {label:"Username", placeholder:"Enter Username",   type:"text",     name:"uname", cols:6},
        {label:"First",    placeholder:"First Name",       type:"text",     name:"fname", cols:3},
        {label:"Last",     placeholder:"Last Name",        type:"text",     name:"lname", cols:3},
        {label:"Password", placeholder:"Password",         type:"password", name:"pass1", cols:6},
        {                  placeholder:"Confirm Password", type:"password", name:"pass2", cols:6},
        {label:"Team",     placeholder:"Team",             type:"number",   name:"team",  cols:2},
        {label:"Authkey",  placeholder:"Authkey",          type:"text",     name:"auth",  cols:4},
    ]}/>
    <div class="my-2"/>
    <a class="my-2 text-sm" href="login"><button>I already have an account</button></a>
</middle>


